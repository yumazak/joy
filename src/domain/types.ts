export type SessionState = "Processing" | "WaitingApproval" | "WaitingInput";

export type SessionInfo = {
  sessionId: string;
  projectPath: string;
  projectName: string;
  state: SessionState;
  lastActivityMs: number;
  lastMessage?: string;
};

export type HookPayload = {
  session_id?: string;
  cwd?: string;
  hook_event_name: string;
  prompt?: string;
  last_assistant_message?: string;
};
