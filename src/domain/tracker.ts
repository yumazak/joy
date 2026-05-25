import { open } from "node:fs/promises";
import type { HookPayload, SessionInfo, SessionState } from "./types";
import { sendNotification } from "./notifier";

const PREVIEW_LIMIT = 100;
const HEAD_READ_BYTES = 64 * 1024;

const toProjectName = (projectPath: string): string => {
  if (!projectPath) {
    return "unknown";
  }

  const normalized = projectPath.replace(/\\+/g, "/").replace(/\/+$/, "");
  if (!normalized) {
    return "unknown";
  }

  const parts = normalized.split("/").filter(Boolean);
  return parts.at(-1) ?? "unknown";
};

const toPreview = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const firstLine = value.split(/\r?\n/u, 1)[0];
  if (!firstLine) {
    return undefined;
  }

  const trimmed = firstLine.trim();
  if (!trimmed) {
    return undefined;
  }

  const chars = Array.from(trimmed);
  if (chars.length <= PREVIEW_LIMIT) {
    return trimmed;
  }

  return `${chars.slice(0, PREVIEW_LIMIT).join("")}…`;
};

export type ResolveLaunchCwd = (
  transcriptPath: string,
) => Promise<string | undefined>;

const defaultResolveLaunchCwd: ResolveLaunchCwd = async (transcriptPath) => {
  let fd: Awaited<ReturnType<typeof open>> | undefined;
  try {
    fd = await open(transcriptPath, "r");
    const buffer = Buffer.alloc(HEAD_READ_BYTES);
    const { bytesRead } = await fd.read(buffer, 0, buffer.length, 0);
    const text = buffer.subarray(0, bytesRead).toString("utf8");
    for (const line of text.split("\n")) {
      if (!line.includes('"cwd"')) continue;
      try {
        const json = JSON.parse(line) as { cwd?: unknown };
        if (typeof json.cwd === "string" && json.cwd.length > 0) {
          return json.cwd;
        }
      } catch {
        // skip malformed line
      }
    }
  } catch {
    // file missing or unreadable — fall back to payload.cwd
  } finally {
    await fd?.close();
  }
  return undefined;
};

export type CreateTrackerOptions = {
  resolveLaunchCwd?: ResolveLaunchCwd;
};

export type SessionTracker = ReturnType<typeof createTracker>;

export const createTracker = (options: CreateTrackerOptions = {}) => {
  const resolveLaunchCwd = options.resolveLaunchCwd ?? defaultResolveLaunchCwd;
  const sessions = new Map<string, SessionInfo>();
  const listeners = new Set<() => void>();
  const launchCwdResolved = new Set<string>();

  const notify = (): void => {
    for (const listener of listeners) {
      listener();
    }
  };

  const onChange = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const applyLaunchCwd = (sessionId: string, cwd: string): void => {
    const session = sessions.get(sessionId);
    if (!session) return;
    if (session.projectPath === cwd) return;
    session.projectPath = cwd;
    session.projectName = toProjectName(cwd);
    notify();
  };

  const tryResolveLaunchCwd = (
    sessionId: string,
    transcriptPath: string | undefined,
  ): void => {
    if (!transcriptPath) return;
    if (launchCwdResolved.has(sessionId)) return;
    launchCwdResolved.add(sessionId);
    void resolveLaunchCwd(transcriptPath).then((cwd) => {
      if (!cwd) return;
      applyLaunchCwd(sessionId, cwd);
    });
  };

  const ensureSession = (
    sessionId: string,
    cwd: string | undefined,
    nowMs: number,
  ): SessionInfo => {
    const existing = sessions.get(sessionId);
    if (existing) {
      return existing;
    }

    const projectPath = cwd ?? "unknown";
    const created: SessionInfo = {
      sessionId,
      projectPath,
      projectName: toProjectName(projectPath),
      state: "WaitingInput" as SessionState,
      lastActivityMs: nowMs,
    };

    sessions.set(sessionId, created);
    return created;
  };

  const handleEvent = (
    payload: HookPayload,
    nowMs: number = Date.now(),
  ): void => {
    const sessionId = payload.session_id;
    if (!sessionId) {
      return;
    }

    if (payload.hook_event_name === "SessionEnd") {
      sessions.delete(sessionId);
      launchCwdResolved.delete(sessionId);
      notify();
      return;
    }

    const session = ensureSession(sessionId, payload.cwd, nowMs);
    session.lastActivityMs = nowMs;
    tryResolveLaunchCwd(sessionId, payload.transcript_path);

    switch (payload.hook_event_name) {
      case "SessionStart":
        session.state = "WaitingInput";
        break;
      case "UserPromptSubmit":
        session.state = "Processing";
        session.lastMessage = toPreview(payload.prompt);
        break;
      case "PreToolUse":
      case "PostToolUse":
      case "PostToolUseFailure":
        session.state = "Processing";
        break;
      case "PermissionRequest":
        session.state = "WaitingApproval";
        sendNotification(
          `[${session.projectName}] Approval Required`,
          payload.hook_event_name,
        );
        break;
      case "Stop":
        session.state = "WaitingInput";
        session.lastMessage = toPreview(payload.last_assistant_message);
        sendNotification(
          `[${session.projectName}] Waiting for Input`,
          session.lastMessage ?? payload.hook_event_name,
        );
        break;
      default:
        break;
    }

    notify();
  };

  const getSessions = (): Readonly<SessionInfo>[] =>
    [...sessions.values()]
      .map((s) => ({ ...s }))
      .sort((a, b) => b.lastActivityMs - a.lastActivityMs);

  return { onChange, handleEvent, getSessions };
};
