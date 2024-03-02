# Surface Treatment Manager
金属表面に処理される「めっき」や「コーティング」などの情報を一括で管理するツールです。<br>
処理１件あたりを「サンプル」と定義しています。<br>
サンプルの検索方法は、「処理名から検索」・「カテゴリから検索」・「メーカーから検索」の３種類を用意しています。

## 作成に至った背景
数ある表面処理の名前や色調、製造元などを人間がすべて記憶しておくことは事実上不可能。<br>
「手軽に検索・閲覧できるツールがあれば」との考えから作成しました。

## 使用技術
- Ruby
- Ruby on Rails
- RSpec
- Rubocop
- PostgreSQL
- Bootstrap
- CircleCI
- Render

## 機能一覧
- サンプル
  - 一覧表示機能
  - 閲覧機能
  - 新規登録機能
  - 更新機能
  - 削除機能
- ユーザー
  - プロフィール閲覧機能
  - 新規登録機能
  - 更新機能
  - 削除機能
- カテゴリ
  - 一覧表示機能
  - 閲覧機能
  - 新規登録機能
  - 更新機能
  - 削除機能
- ページネーション機能
- 画像アップロード機能
- プレビュー画像表示機能
- 検索機能
- ログイン・ログアウト機能
- 管理者機能

## テスト
- RSpec
  - 単体テスト (ModelSpec, HelperSpec)
  - 機能テスト (RequestSpec)
  - 統合テスト (SystemSpec)

## データベース構造
- samples テーブル
  - name
  - category
  - color
  - maker
  - picture
- users テーブル
  - name
  - password
- categories テーブル
  - item