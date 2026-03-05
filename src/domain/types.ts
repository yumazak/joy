import { z } from "zod/v4";

export type SessionState = "Processing" | "WaitingApproval" | "WaitingInput";

export type SessionInfo = {
  sessionId: string;
  projectPath: string;
  projectName: string;
  state: SessionState;
  lastActivityMs: number;
  lastMessage?: string;
};

export const hookPayloadSchema = z.object({
  session_id: z.string().optional(),
  cwd: z.string().optional(),
  hook_event_name: z.string(),
  prompt: z.string().optional(),
  last_assistant_message: z.string().optional(),
});

export type HookPayload = z.infer<typeof hookPayloadSchema>;
