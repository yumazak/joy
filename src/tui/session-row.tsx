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

  return (
    <box flexDirection="column">
      <box flexDirection="row" columnGap={1}>
        <text>
          {session.state === "Processing" ? (
            <Spinner color={color} />
          ) : (
            <span style={{ fg: color }}>{STATE_ICON[session.state]}</span>
          )}
        </text>
        <text>
          <strong>{session.projectName}</strong>
          <span style={{ fg: "#999999" }}> {time}</span>
        </text>
      </box>
      {session.lastMessage && (
        <text wrapMode="none" height={1}>
          <strong style={{ fg: "#aaaaaa" }}>{session.lastMessage}</strong>
        </text>
      )}
    </box>
  );
};
