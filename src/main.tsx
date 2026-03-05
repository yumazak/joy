import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { createTracker } from "./domain/tracker";
import { createApp } from "./server/app";
import { App } from "./tui/app";

const HOST = "127.0.0.1";
const PORT = 50055;

const tracker = createTracker();
const app = createApp(tracker);

const server = Bun.serve({
  hostname: HOST,
  port: PORT,
  fetch: app.fetch,
});

const renderer = await createCliRenderer({
  onDestroy: () => {
    void server.stop(true);
  },
});

const root = createRoot(renderer);
root.render(<App tracker={tracker} />);
