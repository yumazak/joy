import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./relative-time";

describe("formatRelativeTime", () => {
  it("returns just now for less than 60 seconds", () => {
    expect(formatRelativeTime(1000, 59_000)).toBe("just now");
  });

  it("returns minutes for less than 60 minutes", () => {
    expect(formatRelativeTime(0, 5 * 60 * 1000)).toBe("5m ago");
  });

  it("returns hours for less than 24 hours", () => {
    expect(formatRelativeTime(0, 2 * 60 * 60 * 1000)).toBe("2h ago");
  });

  it("returns days for 24 hours or more", () => {
    expect(formatRelativeTime(0, 3 * 24 * 60 * 60 * 1000)).toBe("3d ago");
  });
});
