# Backend 開発環境
- Ruby
- Ruby on Rails
- PostgreSQL
- RSpec
- RuboCop
- Brakeman

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
$ docker compose logs --follow app
```

## コンテナの停止
```sh
$ docker compose down
```
