# joy

<img src="https://raw.githubusercontent.com/yumazak/joy/main/docs/assets/screenshot.png" alt="joy screenshot" width="400">

A terminal dashboard for monitoring [Claude Code](https://claude.ai/claude-code) sessions in real-time.

Joy displays all active Claude Code sessions with their current state, project name, and latest message -- like a LINE/Slack unread indicator for your AI coding sessions.

[日本語ドキュメント](./README.ja.md)

## Install

```bash
npm i -g @yumazak/joy
```

## Usage

```bash
joy
```

Joy starts a local HTTP server on `127.0.0.1:50055` and renders a TUI dashboard.

## Claude Code Hooks Setup

Install the joy-hooks plugin using the Claude Code plugin system:

```
/plugin marketplace add https://github.com/yumazak/joy
/plugin install joy-hooks@joy
```

That's it! The plugin registers all necessary hooks automatically. Hooks silently do nothing when joy is not running, so no error messages will appear.

## Session States

| State | Indicator | Description |
|-------|-----------|-------------|
| Processing | Spinner (cyan) | Claude is actively working |
| WaitingApproval | Yellow dot | Waiting for tool use approval |
| WaitingInput | Green dot | Waiting for user input |

## Hook Events

| Event | Maps to State |
|-------|---------------|
| `PostToolUse` | Processing |
| `PermissionRequest` | WaitingApproval |
| `Stop` / `UserPromptSubmit` | WaitingInput |

## Development

```bash
pnpm install
pnpm run dev      # Start development server
pnpm run test     # Run tests
pnpm run lint     # Run linter
```

## Tech Stack

- [Ink](https://github.com/vadimdemedes/ink) - React-based terminal UI
- [Hono](https://hono.dev) - HTTP server
- [Node.js](https://nodejs.org) - Runtime

## License

MIT
