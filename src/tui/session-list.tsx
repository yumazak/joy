import { Box, Text } from "ink";
import { ScrollView } from "ink-scroll-view";
import type { ScrollViewRef } from "ink-scroll-view";
import type { RefObject } from "react";
import type { SessionInfo } from "../domain/types";
import { SessionRow } from "./session-row";

type SessionListProps = {
  sessions: Readonly<SessionInfo>[];
  scrollRef: RefObject<ScrollViewRef | null>;
};

const Divider = () => (
  <Box borderStyle="single" borderTop={false} borderLeft={false} borderRight={false} borderColor="gray" />
);

export const SessionList = ({ sessions, scrollRef }: SessionListProps) => {
  if (sessions.length === 0) {
    return <Text>No active sessions</Text>;
  }

  return (
    <ScrollView ref={scrollRef}>
      {sessions.map((session, i) => (
        <Box key={session.sessionId} flexDirection="column">
          <SessionRow session={session} />
          {i < sessions.length - 1 && <Divider />}
        </Box>
      ))}
    </ScrollView>
  );
};
