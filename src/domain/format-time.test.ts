import { describe, expect, it } from "vitest";
import { formatTime } from "./format-time";

describe("formatTime", () => {
  it("formats as HH:MM", () => {
    const ms = new Date(2026, 0, 1, 9, 5).getTime();
    expect(formatTime(ms)).toBe("09:05");
  });

  it("pads single digits", () => {
    const ms = new Date(2026, 0, 1, 0, 0).getTime();
    expect(formatTime(ms)).toBe("00:00");
  });

  it("handles afternoon times", () => {
    const ms = new Date(2026, 0, 1, 23, 59).getTime();
    expect(formatTime(ms)).toBe("23:59");
  });
});
