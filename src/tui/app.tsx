import { Box, useInput, useStdout } from "ink";
import type { ScrollViewRef } from "ink-scroll-view";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SessionTracker } from "../domain/tracker";
import type { SessionInfo } from "../domain/types";
import { SessionList } from "./session-list";

type AppProps = {
  tracker: SessionTracker;
};

export const App = ({ tracker }: AppProps) => {
  const { stdout } = useStdout();
  const [rows, setRows] = useState(stdout.rows);
  const scrollRef = useRef<ScrollViewRef>(null);
  const [sessions, setSessions] = useState<Readonly<SessionInfo>[]>(() =>
    tracker.getSessions(),
  );

  useEffect(() => {
    const onResize = () => {
      setRows(stdout.rows);
      scrollRef.current?.remeasure();
    };
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

  useInput((_input, key) => {
    const scrollView = scrollRef.current;
    if (!scrollView) return;
    if (key.upArrow) scrollView.scrollBy(-1);
    if (key.downArrow) {
      const maxOffset = scrollView.getContentHeight() - scrollView.getViewportHeight();
      if (scrollView.getScrollOffset() < maxOffset) scrollView.scrollBy(1);
    }
  });

  return (
    <Box flexDirection="column" padding={1} height={rows}>
      <SessionList sessions={sessions} scrollRef={scrollRef} />
    </Box>
  );
};
