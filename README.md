# Surface Treatment Manager
金属部品表面に処理される「めっき」や「コーティング」などの表面処理に関する情報を、一括で管理するアプリケーションです。<br>
表面処理の検索方法は、「処理名から検索」・「カテゴリから検索」・「メーカー名から検索」・「リストから検索」の４種類があります。<br>
オブジェクトの管理機能は、「表面処理管理」・「カテゴリ管理」・「メーカー管理」・「ユーザー管理」の４種類を用意しました。

## 制作に至った背景
金属部品製造業に携わる人、特に表面処理品を検査する人が、処理の名前や色調、製造元などの情報をすべて記憶しておくことは不可能。<br>
「手軽に情報を検索できるアプリケーションがあれば」との考えから制作しました。<br>

## アプリケーションの使用環境
本アプリケーションはデスクトップ PC で使用されることを想定しています。

## 使用技術
- Ruby
- Ruby on Rails
- Bootstrap
- RSpec
- Rubocop
- Brakeman
- Capybara
- Selenium
- Bullet
- SimpleCov

## 機能一覧
- 表面処理の検索
  - 処理名から検索
  - カテゴリから検索
  - メーカー名から検索
  - リストから検索
- リソースの管理（CRUD）
  - 表面処理管理
  - カテゴリ管理
  - メーカー管理
  - ユーザー管理
- その他
  - ログイン・ログアウト機能
  - ログイン時のユーザー選択機能
  - ページネーション機能
  - 画像アップロード機能
  - プレビュー画像表示機能
  - コメント機能
  - 管理者権限機能

## テスト
- RSpec
  - 単体テスト (Model Spec, Helper Spec)
  - 機能テスト (Request Spec)
  - 統合テスト (System Spec)
- SimpleCov
  - カバレッジ計測

## CI
- GitHub Actions

## データベース
- 開発環境: PostgreSQL version 14.13
- 本番環境: PostgreSQL version 16

## デプロイ
- Render
