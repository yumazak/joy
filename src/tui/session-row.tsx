import type { SessionInfo } from "../domain/types";
import { formatRelativeTime } from "../domain/relative-time";

const stateIcon = (state: SessionInfo["state"]): string => {
  switch (state) {
    case "Processing":
      return "\u2699";
    case "WaitingApproval":
      return "\u231B";
    case "WaitingInput":
      return "\uD83D\uDCA4";
  }
};

type SessionRowProps = {
  session: Readonly<SessionInfo>;
};

export const SessionRow = ({ session }: SessionRowProps) => {
  const relative = formatRelativeTime(session.lastActivityMs);
  const preview = session.lastMessage ?? "-";

  return (
    <box flexDirection="column" paddingLeft={1}>
      <text>
        <strong>{stateIcon(session.state)}</strong>
        <span> {session.projectName}</span>
        <span style={{ fg: "gray" }}> ({relative})</span>
      </text>
      <text>
        <span style={{ fg: "darkgray" }}>{preview}</span>
      </text>
    </box>
  );
};
