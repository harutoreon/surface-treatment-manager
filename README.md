# Surface Treatment Manager
めっきやコーティングなどの表面処理に関する情報を一括で管理するアプリケーションです。<br>
処理名や色調、膜厚や画像など計9種類の情報をデータベースに保存できます。<br>
表面処理の検索には、処理名・カテゴリー・メーカー名・処理一覧の計 4 種類を用意しました。<br>

以下の URL から実際にアプリケーションを試すことができます。

[Surface Treatment Manager](https://surface-treatment-manager-vue.onrender.com/)

## 制作に至った背景
製造業で表面処理品に関わる人が、処理名や色調やメーカー名などの情報をすべて記憶することは不可能。<br>
「誰でも手軽に表面処理の情報を検索できるアプリケーションがあれば」との考えから制作しました。<br>

## 使用技術
- Frontend（SPA）
  - HTML
  - CSS
  - JavaScript
  - Vue.js
  - Vue Router
  - Axios
  - Bootstrap
- Backend（API）
  - Ruby
  - Ruby on Rails
  - PostgreSQL

## 機能一覧
- サンプルの検索
  - 処理名から検索
  - カテゴリーから検索
  - メーカー名から検索
  - 処理一覧から検索
- リソースの管理（CURD）
  - サンプル管理
  - カテゴリー管理
  - メーカー管理
  - ユーザー管理
  - 部署の管理
  - コメントの管理
- その他
  - ログイン・ログアウト機能
  - ログインチェック機能
  - ユーザー選択式ログイン機能
    - 管理者ユーザー
    - 一般ユーザー
  - ページネーション機能
  - 画像アップロード機能
  - 画像プレビュー機能
  - コメント投稿機能

## 認証・認可
- JWT

## コード解析
- Frontend
  - ESLint
- Backend
  - RuboCop

## セキュリティチェック
- Frontend
  - ESLint - eslint-plugin-security
  - npm audit
- Backend
  - Brakeman

## SQL N + 1 対策
- Bullet

## テスト
- Frontend
  - Vitest
    - Component テスト
    - E2E テスト（Routing のみ）
  - Playwright
    - E2E テスト
- Backend
  - RSpec
    - Model Spec
    - Request Spec

## カバレッジ計測
- Frontend
  - C8
- Backend
  - SimpleCov

## CI/CD
- GitHub Actions

## 開発環境
![開発環境の構成図](./configuration_diagram/development_environment.drawio.svg)

## 本番環境
![本番環境の構成図](./configuration_diagram/production_environment.drawio.svg)

## イメージの生成
```sh
$ docker compose build
```

## コンテナの起動
```sh
$ docker compose up --detach
```

## コンテナの停止
```sh
$ docker compose down
```

## ログのリアルタイム表示
```sh
$ docker compose logs --follow backend
$ docker compose logs --follow frontend
$ docker compose logs --follow db
```

## テストの実行
- Frontend
```sh
$ cd frontend/
$ npm run check  # ESlint, Audit, Vitest の実行
```
- Backend
```sh
$ cd backend/
$ bin/rails rspec_test  # RuboCop, Brakeman, RSpec の実行
```
