import { Box, useStdout } from "ink";
import { useCallback, useEffect, useState } from "react";
import type { SessionTracker } from "../domain/tracker";
import type { SessionInfo } from "../domain/types";
import { SessionList } from "./session-list";

type AppProps = {
  tracker: SessionTracker;
};

export const App = ({ tracker }: AppProps) => {
  const { stdout } = useStdout();
  const [rows, setRows] = useState(stdout.rows);
  const [sessions, setSessions] = useState<Readonly<SessionInfo>[]>(() =>
    tracker.getSessions(),
  );

  useEffect(() => {
    const onResize = () => setRows(stdout.rows);
    stdout.on("resize", onResize);
    return () => { stdout.off("resize", onResize); };
  }, [stdout]);

  const refresh = useCallback(() => {
    setSessions(tracker.getSessions());
  }, [tracker]);

  useEffect(() => {
    const unsubscribe = tracker.onChange(refresh);
    return unsubscribe;
  }, [tracker, refresh]);

  return (
    <Box flexDirection="column" padding={1} height={rows}>
      <SessionList sessions={sessions} />
    </Box>
  );
};
