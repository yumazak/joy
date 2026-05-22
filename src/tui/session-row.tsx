import { Box, Text } from "ink";
import { formatTime } from "../domain/format-time";
import type { SessionInfo, SessionState } from "../domain/types";
import { Spinner } from "./spinner";

const STATE_COLOR: Record<SessionState, string> = {
  Processing: "#06b6d4",
  WaitingApproval: "#f59e0b",
  WaitingInput: "#22c55e",
};

const STATE_ICON: Record<SessionState, string> = {
  Processing: "",
  WaitingApproval: "●",
  WaitingInput: "●",
};

type SessionRowProps = {
  session: Readonly<SessionInfo>;
};

export const SessionRow = ({ session }: SessionRowProps) => {
  const color = STATE_COLOR[session.state];
  const time = formatTime(session.lastActivityMs);
  const message = session.lastMessage ?? "";

  return (
    <Box flexDirection="row" columnGap={2}>
      <Text>
        {session.state === "Processing" ? (
          <Spinner color={color} />
        ) : (
          <Text color={color}>{STATE_ICON[session.state]}</Text>
        )}
      </Text>
      <Box flexGrow={1}>
        <Text wrap="truncate" bold color="#aaaaaa">{message}</Text>
      </Box>
      <Text color="#777777">{time}</Text>
    </Box>
  );
};
