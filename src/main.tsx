import { serve } from "@hono/node-server";
import { cli } from "gunshi";
import { render } from "ink";
import { createRequire } from "node:module";
import { createTracker } from "./domain/tracker";
import { createApp } from "./server/app";
import { App } from "./tui/app";

const HOST = "127.0.0.1";
const PORT = 50055;
const require = createRequire(import.meta.url);
const pkg = require("../package.json") as {
  version: string;
  description: string;
};

const run = async () => {
  const tracker = createTracker();
  const app = createApp(tracker);
  const server = serve({ fetch: app.fetch, hostname: HOST, port: PORT });
  const { waitUntilExit } = render(<App tracker={tracker} />);

  try {
    await waitUntilExit();
  } finally {
    server.close();
  }
};

const command = { name: "joy", run };

await cli(process.argv.slice(2), command, {
  name: "joy",
  version: pkg.version,
  description: pkg.description,
});
