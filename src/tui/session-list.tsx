import type { SessionInfo } from "../domain/types";
import { SessionRow } from "./session-row";

type SessionListProps = {
  sessions: Readonly<SessionInfo>[];
};

const Divider = () => <box border={["bottom"]} borderColor="#444444" />;

export const SessionList = ({ sessions }: SessionListProps) => {
  if (sessions.length === 0) {
    return (
      <text>
        <span>No active sessions</span>
      </text>
    );
  }

  return (
    <box flexDirection="column">
      {sessions.map((session, i) => (
        <box key={session.sessionId} flexDirection="column">
          <SessionRow session={session} />
          {i < sessions.length - 1 && <Divider />}
        </box>
      ))}
    </box>
  );
};
