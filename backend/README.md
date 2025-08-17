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
$ bin/rails rspec_test  # RuboCop, Brakeman, RSpec の実行
```
