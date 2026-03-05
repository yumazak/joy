import { useCallback, useEffect, useState } from "react";
import type { SessionInfo } from "../domain/types";
import type { SessionTracker } from "../domain/tracker";
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
    const timer = setInterval(() => refresh(), 1000);
    const unsubscribe = tracker.onChange(refresh);
    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, [tracker, refresh]);

  return (
    <box flexDirection="column" padding={1}>
      <text>
        <strong>joy</strong>
        <span> sessions</span>
      </text>
      <SessionList sessions={sessions} />
    </box>
  );
};
