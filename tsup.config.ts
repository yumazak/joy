import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.tsx"],
  format: "esm",
  target: "node18",
  banner: { js: "#!/usr/bin/env node" },
  clean: true,
  external: ["react", "ink", "hono", "@hono/node-server", "gunshi"],
});
