# joy

<img src="https://raw.githubusercontent.com/yumazak/joy/main/docs/assets/screenshot.png" alt="joy スクリーンショット" width="400">

[Claude Code](https://claude.ai/claude-code) のセッションをリアルタイムで監視するターミナルダッシュボード。

アクティブな Claude Code セッションの状態、プロジェクト名、最新メッセージを一覧表示します。LINE や Slack の未読インジケーターのような感覚で AI コーディングセッションを把握できます。

## インストール

```bash
npm i -g @yumazak/joy
```

## 使い方

```bash
joy
```

`127.0.0.1:50055` でローカル HTTP サーバーを起動し、TUI ダッシュボードを描画します。

## Claude Code Hooks の設定

Claude Code のプラグインシステムで joy-hooks プラグインをインストールしてください:

```
/plugin marketplace add https://github.com/yumazak/joy
/plugin install joy-hooks@joy
```

これだけで完了です。必要な hooks はプラグインが自動で登録します。joy が起動していない時も hooks はエラーを出さずに静かに何もしません。

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
pnpm install
pnpm run dev      # 開発サーバー起動
pnpm run test     # テスト実行
pnpm run lint     # リンター実行
```

## 技術スタック

- [Ink](https://github.com/vadimdemedes/ink) - React ベースのターミナル UI
- [Hono](https://hono.dev) - HTTP サーバー
- [Node.js](https://nodejs.org) - ランタイム

## ライセンス

MIT
