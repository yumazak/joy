import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HookPayload } from "../domain/types";
import type { SessionTracker } from "../domain/tracker";

const MAX_BODY_SIZE = 1024 * 1024; // 1MB

export const createApp = (tracker: SessionTracker): Hono => {
  const app = new Hono();

  app.post("/hooks", bodyLimit({ maxSize: MAX_BODY_SIZE }), async (c) => {
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
