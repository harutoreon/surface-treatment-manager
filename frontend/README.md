# Frontend 開発環境
  - HTML
  - CSS
  - JavaScript
  - Vue.js
  - Vite
  - Vue Router
  - ESLint
  - Vitest
  - Bootstrap

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
$ docker compose logs --follow app
```

## テストの実行
```sh
$ npm run check  # ESlint, Audit, Vitest の実行
```