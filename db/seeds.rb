Faker::Config.locale = 'ja'

# ユーザー
User.create!(name: "Example User", password: "foobar", password_confirmation: "foobar", admin: true)
User.create!(name: "Sample User", password: "foobaz", password_confirmation: "foobaz")

# 表面処理一覧
SAMPLES = [
  { name: "無電解ニッケルめっき", category: "めっき", color: "イエローブラウンシルバー", maker: Faker::Company.name },
  { name: "白銀めっき", category: "めっき", color: "シルバー", maker: Faker::Company.name },
  { name: "金めっき", category: "めっき", color: "ゴールド", maker: Faker::Company.name },
  { name: "銀めっき", category: "めっき", color: "シルバー", maker: Faker::Company.name },
  { name: "銅めっき", category: "めっき", color: "ブロンズ", maker: Faker::Company.name },
  { name: "亜鉛めっき", category: "めっき", color: "シルバー", maker: Faker::Company.name },
  { name: "錫めっき", category: "めっき", color: "ホワイトシルバー", maker: Faker::Company.name },
  { name: "ニッケルめっき", category: "めっき", color: "ライトシルバー", maker: Faker::Company.name },
  { name: "クロムめっき", category: "めっき", color: "シルバー", maker: Faker::Company.name },
  { name: "黒色クロムめっき", category: "めっき", color: "マットブラック", maker: Faker::Company.name },
  { name: "白アルマイト", category: "陽極酸化", color: "ホワイト", maker: Faker::Company.name },
  { name: "黒アルマイト", category: "陽極酸化", color: "ブラック", maker: Faker::Company.name },
  { name: "硬質アルマイト", category: "陽極酸化", color: "ダークブラウン", maker: Faker::Company.name },
  { name: "ユニクロクロメート", category: "化成", color: "シルバー", maker: Faker::Company.name },
  { name: "有色クロメート", category: "化成", color: "イエローブラウン", maker: Faker::Company.name },
  { name: "黒クロメート", category: "化成", color: "ブラック", maker: Faker::Company.name },
  { name: "緑クロメート", category: "化成", color: "オリーブ", maker: Faker::Company.name },
  { name: "四三酸化鉄皮膜", category: "化成", color: "ブラック", maker: Faker::Company.name },
  { name: "パーカー", category: "化成", color: "ブラック", maker: Faker::Company.name },
  { name: "TiN", category: "コーティング", color: "ゴールド", maker: Faker::Company.name },
  { name: "TiC", category: "コーティング", color: "シルバー", maker: Faker::Company.name },
  { name: "TiCN", category: "コーティング", color: "グレー", maker: Faker::Company.name },
  { name: "TiAlN", category: "コーティング", color: "ダークバイオレット", maker: Faker::Company.name },
  { name: "AlCrN", category: "コーティング", color: "ダークグレー", maker: Faker::Company.name },
  { name: "CrN", category: "コーティング", color: "シルバーグレー", maker: Faker::Company.name },
  { name: "DLC", category: "コーティング", color: "ブラック", maker: Faker::Company.name },
  { name: "ブラスト", category: "表面硬化", color: "メタリックグレー", maker: Faker::Company.name },
  { name: "WPC", category: "表面硬化", color: "グレー", maker: Faker::Company.name },
  { name: "レイデント", category: "めっき", color: "ブラック", maker: Faker::Company.name },
  { name: "パルソナイト", category: "表面硬化", color: "グレー", maker: Faker::Company.name },
  { name: "タフトライド", category: "表面硬化", color: "グレー", maker: Faker::Company.name },
  { name: "キリンコートS", category: "表面硬化", color: "メタリックグレー", maker: Faker::Company.name },
  { name: "カナック", category: "表面硬化", color: "ブラウン", maker: Faker::Company.name }
]

picture = File.open("app/assets/images/kitten.jpg")

SAMPLES.each do |sample|
  Sample.create!(name: sample[:name], category: sample[:category], color: sample[:color], maker: sample[:maker], picture: picture)
end
