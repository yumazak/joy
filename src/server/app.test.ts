import { describe, expect, it } from "vitest";
import { createTracker } from "../domain/tracker";
import { createApp } from "./app";

describe("POST /hooks", () => {
  it("accepts payload and updates tracker", async () => {
    const tracker = createTracker();
    const app = createApp(tracker);

    const res = await app.request("/hooks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        session_id: "session-1",
        cwd: "/work/my-project",
        hook_event_name: "UserPromptSubmit",
        prompt: "Implement feature",
      }),
    });

    expect(res.status).toBe(200);

    const sessions = tracker.getSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({
      sessionId: "session-1",
      projectName: "my-project",
      state: "Processing",
      lastMessage: "Implement feature",
    });
  });
});
