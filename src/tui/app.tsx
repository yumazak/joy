import { useCallback, useEffect, useState } from "react";
import type { SessionTracker } from "../domain/tracker";
import type { SessionInfo } from "../domain/types";
import { SessionList } from "./session-list";

type AppProps = {
  tracker: SessionTracker;
};

export const App = ({ tracker }: AppProps) => {
  const [sessions, setSessions] = useState<Readonly<SessionInfo>[]>(() =>
    tracker.getSessions(),
  );

  const refresh = useCallback(() => {
    setSessions(tracker.getSessions());
  }, [tracker]);

  useEffect(() => {
    const unsubscribe = tracker.onChange(refresh);
    return unsubscribe;
  }, [tracker, refresh]);

  return (
    <box flexDirection="column" padding={1}>
      <SessionList sessions={sessions} />
    </box>
  );
};
