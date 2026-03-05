import type { SessionInfo } from "../domain/types";
import { SessionRow } from "./session-row";

type SessionListProps = {
  sessions: Readonly<SessionInfo>[];
};

export const SessionList = ({ sessions }: SessionListProps) => {
  if (sessions.length === 0) {
    return (
      <text>
        <span style={{ fg: "gray" }}>No active sessions</span>
      </text>
    );
  }

  return (
    <box flexDirection="column" gap={1}>
      {sessions.map((session) => (
        <SessionRow key={session.sessionId} session={session} />
      ))}
    </box>
  );
};
