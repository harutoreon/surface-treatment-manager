# Surface Treatment Manager
金属表面に処理される「めっき」や「コーティング」などの情報を一括で管理するツールです。<br>
処理１件あたりを「サンプル」と定義しています。<br>
処理名からサンプルを検索できます。<!-- ・「製造元から検索」・「種類から検索」の３種類を用意しています。 -->

## 作成に至った背景
数ある表面処理の名前や色調、製造元などを人間がすべて記憶しておくことは事実上不可能。<br>
「手軽に検索・閲覧できるツールがあれば」との考えから作成しました。

## 使用技術
- Ruby
- Ruby on Rails
- Bootstrap
- Sass
- RSpec
- Rubocop
- Rake
- PostgreSQL
- CircleCI
- Render

## 機能一覧
- サンプル
  - 一覧表示機能
  - 閲覧機能
  - 新規登録機能
  - 更新機能
  - 削除機能
- ページネーション機能
- 画像アップロード機能
- 検索機能

<!-- ログイン・ログアウト機能
- 新着情報表示機能
- 管理者機能 -->

## テスト
- RSpec
  - 単体テスト（ModelSpec）
  - 機能テスト（RequestSpec）
  - 統合テスト（SystemSpec）

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
