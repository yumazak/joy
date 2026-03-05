# joy

<img src="https://raw.githubusercontent.com/yumazak/joy/main/docs/assets/screenshot.png" alt="joy スクリーンショット" width="400">

[Claude Code](https://claude.ai/claude-code) のセッションをリアルタイムで監視するターミナルダッシュボード。

アクティブな Claude Code セッションの状態、プロジェクト名、最新メッセージを一覧表示します。LINE や Slack の未読インジケーターのような感覚で AI コーディングセッションを把握できます。

## インストール

```bash
bun i -g @yumazak/joy

# or
npm i -g @yumazak/joy
```

> [!NOTE]
> Bun ランタイムが必要です。[OpenTUI](https://github.com/anomalyco/opentui) が Bun に依存しています。

## 使い方

```bash
joy
```

`127.0.0.1:50055` でローカル HTTP サーバーを起動し、TUI ダッシュボードを描画します。

## Claude Code Hooks の設定

`~/.claude/settings.json` に以下の hooks を追加してください:

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

Claude Code が各 hook イベントでセッション情報（セッション ID、cwd、イベント名、メッセージ）を自動送信します。

## セッション状態

| 状態 | 表示 | 説明 |
|------|------|------|
| Processing | スピナー (シアン) | Claude が作業中 |
| WaitingApproval | 黄色の丸 | ツール使用の承認待ち |
| WaitingInput | 緑の丸 | ユーザー入力待ち |

## Hook イベント

| イベント | マッピングされる状態 |
|----------|---------------------|
| `PostToolUse` | Processing |
| `PermissionRequest` | WaitingApproval |
| `Stop` / `UserPromptSubmit` | WaitingInput |

## 開発

```bash
bun install
bun run dev      # 開発サーバー起動
bun run test     # テスト実行
bun run lint     # リンター実行
```

## 技術スタック

- [OpenTUI](https://github.com/anomalyco/opentui) - React ベースのターミナル UI
- [Hono](https://hono.dev) - HTTP サーバー
- [Bun](https://bun.sh) - ランタイム

## ライセンス

MIT
