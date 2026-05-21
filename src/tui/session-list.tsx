import { Box, Text } from "ink";
import { ScrollView } from "ink-scroll-view";
import type { ScrollViewRef } from "ink-scroll-view";
import type { RefObject } from "react";
import type { SessionInfo } from "../domain/types";
import { SessionRow } from "./session-row";
import { toVscodeLink } from "./vscode-link";

type SessionListProps = {
  sessions: Readonly<SessionInfo>[];
  scrollRef: RefObject<ScrollViewRef | null>;
};

type Group = {
  path: string;
  name: string;
  sessions: Readonly<SessionInfo>[];
};

const groupByProject = (sessions: Readonly<SessionInfo>[]): Group[] => {
  const map = new Map<string, Group>();
  for (const s of sessions) {
    const key = s.projectPath || "unknown";
    const existing = map.get(key);
    if (existing) {
      existing.sessions.push(s);
      continue;
    }
    map.set(key, { path: key, name: s.projectName, sessions: [s] });
  }
  for (const g of map.values()) {
    g.sessions.sort((a, b) => b.lastActivityMs - a.lastActivityMs);
  }
  return [...map.values()].sort(
    (a, b) => (b.sessions[0]?.lastActivityMs ?? 0) - (a.sessions[0]?.lastActivityMs ?? 0),
  );
};

type GroupHeaderProps = { path: string; name: string; count: number };

const GroupHeader = ({ path, name, count }: GroupHeaderProps) => (
  <Box flexDirection="row" columnGap={1}>
    <Text bold color="#cccccc">{name.toUpperCase()}</Text>
    <Text color="#666666">{count}</Text>
    <Text color="#06b6d4">{toVscodeLink(path, "[open]")}</Text>
  </Box>
);

export const SessionList = ({ sessions, scrollRef }: SessionListProps) => {
  if (sessions.length === 0) {
    return <Text>No active sessions</Text>;
  }

  const groups = groupByProject(sessions);

  return (
    <ScrollView ref={scrollRef}>
      {groups.map((group) => (
        <Box key={group.path} flexDirection="column">
          <GroupHeader path={group.path} name={group.name} count={group.sessions.length} />
          {group.sessions.map((session) => (
            <SessionRow key={session.sessionId} session={session} />
          ))}
        </Box>
      ))}
    </ScrollView>
  );
};
