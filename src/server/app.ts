import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { hookPayloadSchema } from "../domain/types";
import type { SessionTracker } from "../domain/tracker";

const MAX_BODY_SIZE = 1024 * 1024; // 1MB

export const createApp = (tracker: SessionTracker): Hono => {
  const app = new Hono();

  app.post("/hooks", bodyLimit({ maxSize: MAX_BODY_SIZE }), async (c) => {
    let raw: unknown;
    try {
      raw = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }

    const result = hookPayloadSchema.safeParse(raw);
    if (!result.success) {
      return c.json({ error: "Invalid payload", issues: result.error.issues }, 400);
    }

    tracker.handleEvent(result.data);
    return c.json({ ok: true }, 200);
  });

  return app;
};
