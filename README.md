# BASEGYM24 予約管理アプリ

## 実装前整理（簡潔版）
### ディレクトリ構成
- `app/`: 画面とAPI（会員・管理者）
- `components/`: 共通UI
- `lib/`: 認証、日付整形、予約ロジック
- `prisma/`: DBスキーマ・seed

### 主要画面一覧
- 共通: ログイン、ダッシュボード振り分け
- 会員: 予約作成、予約一覧、マイページ
- 管理者: 管理トップ、予約一覧/詳細、会員一覧/編集、営業時間設定

### DB設計
- `User`（管理者/会員ログイン）
- `Member`（会員情報）
- `Course`（30分/60分）
- `Reservation`（予約本体）
- `BusinessHour`（曜日別営業時間）
- `ClosedDay`（休館日）
- `AppSetting`（キャンセル期限等）

### 実装順
1. Prisma schema + seed
2. 認証/共通レイアウト
3. 会員予約フロー
4. 管理者予約管理
5. 会員管理・営業時間設定
6. README整備

## アプリ概要
個人経営パーソナルジム向けの予約管理Webアプリです。会員予約、管理者の予約ステータス更新、会員管理、営業日・営業時間設定をMVPとして実装しています。

## 使用技術
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma
- SQLite

## セットアップ方法
```bash
npm install
cp .env.example .env
```

## インストール手順
```bash
npm install
```

## Prismaの実行手順
```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

## seed実行方法
```bash
npm run prisma:seed
```

## ローカル起動方法
```bash
npm run dev
```

## 主要画面説明
### 共通
- ログイン画面: 管理者/会員ログイン
- ダッシュボード: ロール別画面へ遷移

### 会員側
- 予約作成画面: 日付・コース選択で空き枠表示、予約作成
- 予約確認画面: 作成後すぐ一覧反映
- マイページ: 会員基本情報表示
- 自分の予約一覧: 予約状態確認、キャンセル

### 管理者側
- 管理ダッシュボード: 予約件数・会員数の概要
- 予約一覧画面: 日別/週別表示
- 予約詳細画面: 詳細確認とステータス更新
- 会員一覧画面: 会員登録/一覧表示
- 会員詳細/編集画面: 会員編集と予約履歴確認
- 営業日・営業時間設定画面: 曜日別営業時間、休館日、キャンセル期限設定

## サンプルログイン情報
- 管理者: `admin@basegym24.local` / `admin123`
- 会員: `member1@example.com` / `member123`

## 今後の拡張案
- パスワードのハッシュ化と本格認証基盤への差し替え
- トレーナー別予約枠対応
- PostgreSQL/Supabase移行
- 予約通知（メール/LINE）
- カレンダーUIの強化
