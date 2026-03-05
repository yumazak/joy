import { useEffect, useState } from "react";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

type SpinnerProps = {
  color?: string;
};

export const Spinner = ({ color = "white" }: SpinnerProps) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 150);
    return () => clearInterval(timer);
  }, []);

  return <span style={{ fg: color }}>{FRAMES[tick % FRAMES.length]}</span>;
};
