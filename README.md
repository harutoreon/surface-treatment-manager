# Surface Treatment Manager
めっきやコーティングなどの表面処理に関する情報を一括で管理するアプリケーションです。<br>
処理名や色調、膜厚や画像など計 8 種類の情報をデータベースに保存できます。<br>
表面処理の検索には、処理名・カテゴリー・メーカー名・処理一覧の計 4 種類を用意しました。<br>

## 制作に至った背景
製造業で表面処理品に関わる人が、処理名や色調やメーカー名などの情報をすべて記憶することは不可能。<br>
「誰でも手軽に表面処理の情報を登録・検索できるアプリケーションがあれば」との考えから制作しました。<br>

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
- その他
  - ログイン・ログアウト機能
  - ユーザー選択式ログイン機能
    - 管理者ユーザー
    - 一般ユーザー
  - ページネーション機能
  - 画像アップロード機能
  - 画像プレビュー機能
  - サンプルへのコメント機能

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
- Backend
  - RSpec
    - Model Spec
    - Request Spec

## カバレッジ計測
- Backend
  - SimpleCov

## CI/CD
- GitHub Actions

## 開発環境
<!-- - Docker Compose -->
![開発環境の構成図](./development_environment_configuration_diagram.drawio.svg)
## 本番環境
- Render
  - Frontend
    - Static Site / Static
  - Backend
    - Web Service / Docker
    - PostgreSQL  / PostgreSQL 16

## イメージの生成
```sh
$ docker compose build
```

## コンテナの起動
```sh
$ docker compose up --detach
```

## ログのリアルタイム表示
```sh
$ docker compose logs --follow backend
$ docker compose logs --follow frontend
$ docker compose logs --follow db
```

## コンテナの停止
```sh
$ docker compose down
```
