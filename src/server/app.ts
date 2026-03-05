import { Hono } from "hono";
import type { HookPayload } from "../domain/types";
import type { SessionTracker } from "../domain/tracker";

export const createApp = (tracker: SessionTracker): Hono => {
  const app = new Hono();

  app.post("/hooks", async (c) => {
    let payload: unknown;
    try {
      payload = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof (payload as { hook_event_name?: unknown }).hook_event_name !== "string"
    ) {
      return c.json({ error: "Invalid payload" }, 400);
    }

    tracker.handleEvent(payload as HookPayload);
    return c.json({ ok: true }, 200);
  });

  return app;
};
