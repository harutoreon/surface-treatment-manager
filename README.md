# Surface Treatment Manager
金属部品表面に処理される「めっき」や「コーティング」などの表面処理に関する情報を、一括で管理するアプリケーションです。<br>
表面処理の検索方法は、「処理名から検索」・「カテゴリから検索」・「メーカー名から検索」・「リストから検索」の４種類があります。<br>
オブジェクトの管理機能は、「表面処理管理」・「カテゴリ管理」・「メーカー管理」・「ユーザー管理」の４種類を用意しました。

## 制作に至った背景
金属部品製造業に携わる人、特に表面処理品を検査する人が、処理の名前や色調、製造元などの情報をすべて記憶しておくことは不可能。<br>
「手軽に情報を検索できるアプリケーションがあれば」との考えから制作しました。<br>

## 使用技術
- Frontend
  - Vue.js（SPAで実装予定）
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

## コード解析
- Rubocop

## セキュリティチェック
- Brakeman

## SQL N + 1 対策
- Bullet

## テスト
- RSpec
  - 単体テスト (Model Spec)
  - 機能テスト (Request Spec)

## カバレッジ計測
- SimpleCov

## CI/CD
- GitHub Actions

## 開発環境
- Docker Compose

## 本番環境
- Render
  - Frontend
    - Static Site / Docker
  - Backend
    - Web Service, PostgreSQL / Docker
