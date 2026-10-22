# ChatGPTの潜在能力を引き出す10のプロンプト技術（特典ページ）

> 設計の共通原則は `~/.claude/CLAUDE.md` に従う。要件は `docs/requirements.md`。

## プロジェクト設定

技術スタック: HTML5 / CSS3 / Vanilla JavaScript（ビルドなし）、GitHub Pages。backend・database・環境変数なし（`.env` 系は作らない）。

## 運用ルール

- note特典と同じ配色（アイボリー×ブラウン＋くすみピンク）の複製。複製元と既存特典は未変更
- 文章・プロンプト・リンクの単一の源は `js/content.js`。色・余白は `css/style.css` の `:root`
- 10個のプロンプトは制作指示書の文面を変更しない（意味・文言・改行）。誇大表現・実績の創作はしない
- CTA: ファーストビュー直下（教科書5大特典の画像）と最後の2か所。最後は「悩み→つなぎ→LINE」。OGP画像は設定しない
- 本番公開（GitHub Pagesへの反映）はユーザーの確認を得てから

## 命名・品質

- ファイル kebab-case / 変数 camelCase / 関数100行・ファイル700行・複雑度10・行長120以下
- ローカル確認: `python3 -m http.server <port>` を1つだけ起動

## ドキュメント管理

許可: `docs/requirements.md` / `docs/SCOPE_PROGRESS.md` / `README.md` / `LICENSE.md`。他は要許諾。

## 品質ゲート

- 第一防壁: ローカル git hook（pre-commit: 秘密情報拒否＋JS構文）
- 最終防壁: GitHub Actions `verify`（JS構文・必須ファイル・index.htmlのリンク切れ）
- ブランチ: `main`＝公開 / `develop`＝編集
