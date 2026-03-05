# joy

<img src="https://raw.githubusercontent.com/yumazak/joy/main/docs/assets/screenshot.png" alt="joy screenshot" width="400">

A terminal dashboard for monitoring [Claude Code](https://claude.ai/claude-code) sessions in real-time.

Joy displays all active Claude Code sessions with their current state, project name, and latest message -- like a LINE/Slack unread indicator for your AI coding sessions.

[日本語ドキュメント](./README.ja.md)

## Install

```bash
bun i -g @yumazak/joy

# or
npm i -g @yumazak/joy
```

> [!NOTE]
> Bun runtime is required. The app uses [OpenTUI](https://github.com/anomalyco/opentui) which depends on Bun.

## Usage

```bash
joy
```

Joy starts a local HTTP server on `127.0.0.1:50055` and renders a TUI dashboard.

## Claude Code Hooks Setup

Add the following hooks to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [{ "type": "http", "url": "http://127.0.0.1:50055/hooks" }]
      }
    ],
    "SessionEnd": [
      {
        "hooks": [{ "type": "http", "url": "http://127.0.0.1:50055/hooks" }]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [{ "type": "http", "url": "http://127.0.0.1:50055/hooks" }]
      }
    ],
    "Stop": [
      {
        "hooks": [{ "type": "http", "url": "http://127.0.0.1:50055/hooks" }]
      }
    ],
    "PermissionRequest": [
      {
        "hooks": [{ "type": "http", "url": "http://127.0.0.1:50055/hooks" }]
      }
    ],
    "PostToolUse": [
      {
        "hooks": [{ "type": "http", "url": "http://127.0.0.1:50055/hooks" }]
      }
    ]
  }
}
```

Claude Code automatically sends session context (session ID, cwd, hook event name, messages) with each hook event.

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
bun install
bun run dev      # Start development server
bun run test     # Run tests
bun run lint     # Run linter
```

## Tech Stack

- [OpenTUI](https://github.com/anomalyco/opentui) - React-based terminal UI
- [Hono](https://hono.dev) - HTTP server
- [Bun](https://bun.sh) - Runtime

## License

MIT
