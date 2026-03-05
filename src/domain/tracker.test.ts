import { describe, expect, it } from "vitest";
import { createTracker } from "./tracker";

describe("SessionTracker", () => {
  it("ignores payload without session_id", () => {
    const tracker = createTracker();
    tracker.handleEvent({ hook_event_name: "SessionStart" }, 1000);
    expect(tracker.getSessions()).toEqual([]);
  });

  it("maps event to state transitions", () => {
    const tracker = createTracker();

    tracker.handleEvent({ session_id: "s1", cwd: "/tmp/a", hook_event_name: "SessionStart" }, 1000);
    expect(tracker.getSessions()[0]?.state).toBe("WaitingInput");

    tracker.handleEvent({ session_id: "s1", hook_event_name: "UserPromptSubmit", prompt: "hello" }, 1100);
    expect(tracker.getSessions()[0]?.state).toBe("Processing");

    tracker.handleEvent({ session_id: "s1", hook_event_name: "PermissionRequest" }, 1200);
    expect(tracker.getSessions()[0]?.state).toBe("WaitingApproval");

    tracker.handleEvent({ session_id: "s1", hook_event_name: "PreToolUse" }, 1250);
    expect(tracker.getSessions()[0]?.state).toBe("Processing");

    tracker.handleEvent({ session_id: "s1", hook_event_name: "PostToolUseFailure" }, 1260);
    expect(tracker.getSessions()[0]?.state).toBe("Processing");

    tracker.handleEvent({ session_id: "s1", hook_event_name: "SubagentStart" }, 1270);
    expect(tracker.getSessions()[0]?.state).toBe("Processing");

    tracker.handleEvent({ session_id: "s1", hook_event_name: "SubagentStop" }, 1280);
    expect(tracker.getSessions()[0]?.state).toBe("Processing");

    tracker.handleEvent({ session_id: "s1", hook_event_name: "Stop" }, 1300);
    expect(tracker.getSessions()[0]?.state).toBe("WaitingInput");
  });

  it("deletes session on SessionEnd", () => {
    const tracker = createTracker();
    tracker.handleEvent({ session_id: "s1", cwd: "/tmp/a", hook_event_name: "SessionStart" }, 1000);
    tracker.handleEvent({ session_id: "s1", hook_event_name: "SessionEnd" }, 2000);
    expect(tracker.getSessions()).toEqual([]);
  });

  it("sorts by lastActivityMs desc", () => {
    const tracker = createTracker();
    tracker.handleEvent({ session_id: "a", cwd: "/tmp/a", hook_event_name: "SessionStart" }, 1000);
    tracker.handleEvent({ session_id: "b", cwd: "/tmp/b", hook_event_name: "SessionStart" }, 3000);
    tracker.handleEvent({ session_id: "c", cwd: "/tmp/c", hook_event_name: "SessionStart" }, 2000);

    expect(tracker.getSessions().map((s) => s.sessionId)).toEqual(["b", "c", "a"]);
  });

  it("sets lastMessage from prompt on UserPromptSubmit", () => {
    const tracker = createTracker();
    tracker.handleEvent(
      { session_id: "s1", cwd: "/tmp/a", hook_event_name: "UserPromptSubmit", prompt: "hello world" },
      1000,
    );
    expect(tracker.getSessions()[0]?.lastMessage).toBe("hello world");
  });

  it("sets lastMessage from last_assistant_message on Stop", () => {
    const tracker = createTracker();
    tracker.handleEvent({ session_id: "s1", cwd: "/tmp/a", hook_event_name: "SessionStart" }, 1000);
    tracker.handleEvent(
      { session_id: "s1", hook_event_name: "Stop", last_assistant_message: "done" },
      2000,
    );
    expect(tracker.getSessions()[0]?.lastMessage).toBe("done");
  });

  it("does not update lastMessage on PostToolUse", () => {
    const tracker = createTracker();
    tracker.handleEvent(
      { session_id: "s1", cwd: "/tmp/a", hook_event_name: "UserPromptSubmit", prompt: "initial" },
      1000,
    );
    tracker.handleEvent(
      { session_id: "s1", hook_event_name: "PostToolUse", last_assistant_message: "should-not-appear" },
      2000,
    );
    expect(tracker.getSessions()[0]?.lastMessage).toBe("initial");
  });

  it("truncates first-line preview to 100 chars", () => {
    const tracker = createTracker();
    const long = `${"x".repeat(101)}\nsecond line`;

    tracker.handleEvent(
      {
        session_id: "s1",
        cwd: "/Users/yumazak/dev/personal/joy",
        hook_event_name: "UserPromptSubmit",
        prompt: long,
      },
      1000,
    );

    const session = tracker.getSessions()[0];
    expect(session?.projectName).toBe("joy");
    expect(session?.lastMessage).toBe(`${"x".repeat(100)}…`);
  });

  it("keeps unknown as projectName when cwd is missing", () => {
    const tracker = createTracker();
    tracker.handleEvent({ session_id: "s1", hook_event_name: "UnknownEvent" }, 1000);
    expect(tracker.getSessions()[0]?.projectName).toBe("unknown");
  });

  it("resets cwd to unknown on SessionStart without cwd", () => {
    const tracker = createTracker();
    tracker.handleEvent({ session_id: "s1", cwd: "/tmp/a", hook_event_name: "SessionStart" }, 1000);
    tracker.handleEvent({ session_id: "s1", hook_event_name: "SessionStart" }, 2000);
    expect(tracker.getSessions()[0]?.projectName).toBe("unknown");
  });
});
