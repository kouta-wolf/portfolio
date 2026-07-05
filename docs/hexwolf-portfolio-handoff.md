# HexWolf ポートフォリオサイト構築 - 引き継ぎメモ

## プロジェクト概要
- **名前**: HexWolf(サイト名/ハンドルネームブランド)
  - 由来: TRPG好き(ソードワールド2.5)+ Wolf(HN "ookami_kouta"由来)+ 「6」(2d6ダイス、hex=6)を掛け合わせた造語
  - 候補として d20wolf, DiceWolf, DireWolf なども検討したが、DiceWolf/DireWolfは既存の有名アカウントと被るため回避
- **用途**: 2つのサイトを別プロジェクトとして構築する
  1. **ポートフォリオサイト**(WEBエンジニア転職用。本人はまだWEBエンジニアではなく、現在は通信制プログラミングスクール在籍)
  2. **個人ブログ**(WordPress運用経験あり。管理画面の重さ・コストがネックで離脱。今回はSSGで解決したい)
- **今回作業するのはポートフォリオサイトから着手**

## 技術スタック(決定事項)
- **SSG**: Astro
  - 理由: 静的HTML中心+必要な部分だけJS化する「アイランドアーキテクチャ」がポートフォリオ/ブログ用途に合う
  - Reactをアイランドとして埋め込み可能
- **UIライブラリ**: React(アイランドとして部分的に使用)
- **ホスティング**: Cloudflare Pages(無料枠重視。帯域無制限、ビルド回数500回/月)
- **ドメイン**: 未定(一旦保留。将来的にCloudflare Registrarでの取得も検討。`.dev`系を希望していたが `hexwolf.dev` は現時点で未確認)

## アイランドアーキテクチャの理解度
- 概念は今回の会話で説明済み。Rails/Hotwireのstream更新との対比で理解済み
- 「静的HTML+必要な部分だけJS」という設計思想がHotwireと共通する点に納得感あり

## ポートフォリオサイトの要件
- **掲載コンテンツ**: 現時点でプロジェクト数は少ない
  - 卒業制作(vitals-roll: Rails + Hotwireで作るソードワールド2.5用バフ/デバフ管理ツール)
  - 個人ブログ(今後作成予定)
- **各プロジェクトに持たせる情報**:
  - 画像
  - Render URL(デプロイ先)
  - GitHub URL
- **データ管理方針**: Astroの Content Collections を使い、Markdownファイル1つ = プロジェクト1つの構成にする(frontmatterでtitle/description/image/renderUrl/githubUrl/techStackなどを管理)

## インタラクティブ要素(React島にする候補)
1. **お問い合わせフォームのバリデーション** → React島(`client:load`)で実装する方針
2. **プロジェクト一覧のタブ切り替え**
   - プロジェクト数が少ない(2〜3件程度)ため、JSを使わずCSSのみ(`:target`やradioボタン+CSS)で実現できる可能性もある
   - アニメーションや細かい制御が必要ならReact島(`client:visible`など)にする、という判断基準

## 次にやること(未着手)
- [ ] Astroプロジェクトの新規作成(`npm create astro@latest`)
- [ ] Reactインテグレーション追加(`npx astro add react`)
- [ ] Tailwind追加の要否検討(デザインカンプ確定後でも可)
- [ ] Content Collectionsのスキーマ設計(projects用)
- [ ] ワイヤーフレーム/ページ構成の設計(Affinity Designer / Penpotで作業予定、グレースケール規約で色は後回しにする方針)
- [ ] お問い合わせフォームの実装(React + バリデーションライブラリ検討)
- [ ] Cloudflare Pagesへのデプロイ設定

## 参考: 本人のバックグラウンド(次のClaudeが把握しておくと良い情報)
- Rails + Hotwire での卒業制作(vitals-roll)を進行中
- WSL(Ubuntu)+ Zed/VSCode + Claude Code CLIで開発環境構築済み
- Affinity Designer / Penpotでワイヤーフレーム作成経験あり(1440×900px canvas、グレースケール規約)
- 元看護師(訪問看護含む)という経歴を医療系IT転職の差別化要素として位置づけている
