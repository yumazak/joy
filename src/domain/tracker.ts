import type { HookPayload, SessionInfo, SessionState } from "./types";

const PREVIEW_LIMIT = 100;

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

export type SessionTracker = ReturnType<typeof createTracker>;

export const createTracker = () => {
  const sessions = new Map<string, SessionInfo>();
  const listeners = new Set<() => void>();

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

  const ensureSession = (sessionId: string, cwd: string | undefined, nowMs: number): SessionInfo => {
    const existing = sessions.get(sessionId);
    if (existing) {
      if (cwd && cwd !== existing.projectPath) {
        existing.projectPath = cwd;
        existing.projectName = toProjectName(cwd);
      }
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

  const handleEvent = (payload: HookPayload, nowMs: number = Date.now()): void => {
    const sessionId = payload.session_id;
    if (!sessionId) {
      return;
    }

    if (payload.hook_event_name === "SessionEnd") {
      sessions.delete(sessionId);
      notify();
      return;
    }

    const session = ensureSession(sessionId, payload.cwd, nowMs);
    session.lastActivityMs = nowMs;

    switch (payload.hook_event_name) {
      case "SessionStart":
        if (payload.cwd) {
          session.projectPath = payload.cwd;
          session.projectName = toProjectName(payload.cwd);
        } else {
          session.projectPath = "unknown";
          session.projectName = "unknown";
        }
        session.state = "WaitingInput";
        break;
      case "UserPromptSubmit":
        session.state = "Processing";
        session.lastMessage = toPreview(payload.prompt);
        break;
      case "PreToolUse":
      case "PostToolUse":
      case "PostToolUseFailure":
      case "SubagentStart":
      case "SubagentStop":
        session.state = "Processing";
        break;
      case "PermissionRequest":
        session.state = "WaitingApproval";
        break;
      case "Stop":
        session.state = "WaitingInput";
        session.lastMessage = toPreview(payload.last_assistant_message);
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
