import { Box, Text } from "ink";
import type { SessionInfo } from "../domain/types";
import { SessionRow } from "./session-row";

type SessionListProps = {
  sessions: Readonly<SessionInfo>[];
};

const Divider = () => (
  <Box borderStyle="single" borderTop={false} borderLeft={false} borderRight={false} borderColor="gray" />
);

export const SessionList = ({ sessions }: SessionListProps) => {
  if (sessions.length === 0) {
    return <Text>No active sessions</Text>;
  }

  return (
    <Box flexDirection="column">
      {sessions.map((session, i) => (
        <Box key={session.sessionId} flexDirection="column">
          <SessionRow session={session} />
          {i < sessions.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};
