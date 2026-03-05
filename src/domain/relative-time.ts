export const formatRelativeTime = (lastActivityMs: number, nowMs: number = Date.now()): string => {
  const diffMs = Math.max(0, nowMs - lastActivityMs);
  const secs = Math.floor(diffMs / 1000);

  if (secs < 60) {
    return "just now";
  }

  const mins = Math.floor(secs / 60);
  if (mins < 60) {
    return `${mins}m ago`;
  }

  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
