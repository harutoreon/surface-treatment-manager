Faker::Config.locale = 'ja'

# ユーザー
User.create!(name: "Example User", password: "foobar", password_confirmation: "foobar", admin: true)
User.create!(name: "Sample User", password: "foobaz", password_confirmation: "foobaz")

# 表面処理一覧
SAMPLES = [
  { name: "無電解ニッケルめっき", category: "めっき", color: "飴色のシルバー", maker: Faker::Company.name },
  { name: "白銀めっき", category: "めっき", color: "シルバー", maker: Faker::Company.name },
  { name: "金めっき", category: "めっき", color: "ゴールド", maker: Faker::Company.name },
  { name: "銀めっき", category: "めっき", color: "シルバー", maker: Faker::Company.name },
  { name: "銅めっき", category: "めっき", color: "ブロンズ", maker: Faker::Company.name }
]

picture = File.open("app/assets/images/kitten.jpg")

SAMPLES.each do |sample|
  Sample.create!(name: sample[:name], category: sample[:category], color: sample[:color], maker: sample[:maker], picture: picture)
end
