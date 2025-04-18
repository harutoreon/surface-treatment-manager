# Surface Treatment Manager
金属部品表面に処理される「めっき」などの表面処理に関する情報を、一括で管理するアプリケーションです。<br>
「処理名から検索」・「カテゴリから検索」・「メーカー名から検索」・「リストから検索」の4種類の検索機能を使って表面処理の情報を検索できます。<br>

## 制作に至った背景
金属部品製造業に携わる人、特に表面処理品を検査する人が、処理名や色調や製造元などの情報をすべて記憶しておくことは不可能です。<br>
「誰でも手軽に表面処理の情報を登録・検索できるアプリケーションがあれば」との考えから制作しています。<br>

## 使用技術
- Frontend
  - HTML
  - CSS
  - JavaScript
  - Vue.js（SPA）
  - Vue Router
  - Axios
  - Bootstrap
- Backend
  - Ruby
  - Ruby on Rails（API）
  - PostgreSQL

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
  - コメント機能
  - ページネーション機能

## コード解析
- Frontend
  - ESLint
- Backend
  - Rubocop

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
    - コンポーネントテスト
    - E2Eテスト
- Backend
  - RSpec
    - 単体テスト
    - 機能テスト

## カバレッジ計測
- Backend
  - SimpleCov

## CI/CD
- GitHub Actions

## 開発環境
- Docker Compose

## 本番環境
- Render
  - Frontend
    - Static Site / Static
  - Backend
    - Web Service, PostgreSQL / Docker

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
