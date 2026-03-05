import { Hono } from "hono";
import type { HookPayload } from "../domain/types";
import type { SessionTracker } from "../domain/tracker";

export const createApp = (tracker: SessionTracker): Hono => {
  const app = new Hono();

  app.post("/hooks", async (c) => {
    const payload = (await c.req.json()) as HookPayload;
    tracker.handleEvent(payload);
    return c.json({ ok: true }, 200);
  });

  return app;
};
