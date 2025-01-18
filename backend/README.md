# Backend 開発環境
- Ruby（3.2.6）
- Ruby on Rails（7.2.2）
- PostgreSQL（16.4）
- RSpec（3.13）
- RuboCop（1.69.2）
- brakeman（7.0.0）

## コンテナの起動
```sh
$ docker compose up -d
```

## ログのリアルタイム表示
```sh
$ docker compose logs -f app
```

## コンテナの停止
```sh
$ docker compose down
```
