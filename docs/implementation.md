# 実装手順: TRPGルールブック風ダークテーマ リデザイン

[redesign-plan-trpg-rulebook.md](./redesign-plan-trpg-rulebook.md) の方針を実装に落とすための作業手順。

## 現状とのギャップ

| 項目 | 現状 | 計画 |
|---|---|---|
| カラー | `primary`/`secondary`/`base`/`letter`/`accent` の5色 | 3色(`bg`/`text`/`accent`)+ 紙2色 に再編 |
| 背景 | 全体に `background.jpg` テクスチャ | 蒼黒ベース +「本の中身」だけ `paper_00084.jpg` |
| レイアウト | `min-h-[50vh]` の縦積み | 1画面1セクション + scroll-snap + 非対称2カラム |
| Works | タブ切替のインライン表示 | 見開き2作品カード + モーダル |
| フォント | OS標準のみ | 見出しに Zen Old Mincho |
| ナビ | Header簡易ナビのみ | しおりTOC + ヘッダー常設ナビ + ローディング演出 |

## 手順

### フェーズ0: 準備・土台

1. **Issue/ブランチ作成**（Issue番号に紐づけて命名）
2. **カラートークン再編** — `src/styles/global.css` の `@theme` を `--color-bg` / `--color-text` / `--color-accent` / `--color-paper-bg` / `--color-paper-text` に置換（`primary`/`secondary`/`base`/`letter` を廃止）
3. **紙レイヤーのユーティリティ作成** — `.paper`（または `.bg-paper`）クラスを `@layer utilities` に定義。`paper_00084.jpg` を `background-size: cover` + `--color-paper-bg` を `background-blend-mode: multiply` で重ねる
4. **フォント導入** — Zen Old Mincho を読み込み、`--font-heading` トークン化。見出し/章タイトルのみ適用

### フェーズ1: レイアウト骨格

5. **Layout.astro 改修** — 全体背景を蒼黒（`--color-bg`）に。既存の `background.jpg` テクスチャ適用を撤去/再検討。`scroll-snap-type: y (mandatory)` を body/main に設定
6. **各セクションを `min-h-screen` + snap 化** — `min-h-[50vh]` を全廃し `min-h-screen snap-start` へ
7. **「ページをめくる」誘導ビジュアル** — 右下固定の折り目風エレメント（次セクションへスクロール）

### フェーズ2: セクション本文

8. **章立て表記の反映** — About →「第一章 プロフィール」等（ヘッダー短縮形 / TOCフル表記の使い分け）
9. **非対称2カラム化** — About.astro 等を「本文カラム（紙・狭め・行間広め）+ サイドマージン（挿絵アイコン/フレーバー）」に。`md` で1カラム
10. **Hero改修** — 各セクションへのジャンプリンクを設置
11. **Social/Contact整備** — 計画の章立て（第三章 連絡先 / 終章 お問い合わせ）。※Contactは現状未実装なので新規追加

### フェーズ3: Works（見開き + モーダル）

12. **Portfolio.tsx を見開きカード化** — タブ切替を廃止し、1スナップに作品2つのカードグリッド。掲載作品を厳選（全件掲載しない）
13. **モーダル実装** — カードクリックで中央ダイアログ + 背景暗転。紙レイヤー質感で「開く」トランジション。閉じる導線 = バツボタン + オーバーレイクリック

### フェーズ4: ナビ・演出

14. **しおり（リボン）TOC** — 左端固定タブ、ホバー（モバイルはタップ）でスライドイン。200〜300ms ease-out
15. **Header.astro 常設ナビ更新** — 章立て短縮形に。「いかにもヘッダー」な横長バー(`bg-base border-b-2 border-primary`)は廃止し、左上にページタイトル(HexWolf) + その下にナビゲーション、という縦積み配置に変更。下線(`border-b-2`)も撤去
16. **ローディング画面** — Webフォント読込を利用した「本の表紙が開く」アニメーション

### フェーズ5: 仕上げ

17. **旧資産の掃除** — 未使用になった `background.jpg`・旧カラー参照を全ファイルから除去（grep で残存チェック）
18. **レスポンシブ/動作確認** — `astro dev --background` で起動し、snap挙動・モーダル・TOC・md崩しを検証
19. **コミット** — Conventional Commits（feat: 等）で段階コミット → PR

## 着手順の目安

まず **フェーズ0〜1（カラー再編・紙レイヤー・レイアウト骨格）** が全体の土台になるため、ここから始める。

## 実装前に詰める未確定点

- Contactセクションの具体的な内容（フォーム / メールリンク等）
- 掲載作品の選定（厳選する作品）
- 挿絵アイコンの用意（サイドマージン用）
