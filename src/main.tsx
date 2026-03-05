import { serve } from "@hono/node-server";
import { render } from "ink";
import { createTracker } from "./domain/tracker";
import { createApp } from "./server/app";
import { App } from "./tui/app";

const HOST = "127.0.0.1";
const PORT = 50055;

const tracker = createTracker();
const app = createApp(tracker);

const server = serve({ fetch: app.fetch, hostname: HOST, port: PORT });

const { waitUntilExit } = render(<App tracker={tracker} />);

await waitUntilExit();
server.close();
