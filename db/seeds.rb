NAMES = [
  "金めっき",
  "銀めっき",
  "銅めっき",
  "亜鉛めっき",
  "光沢ニッケルめっき",
  "無光沢ニッケルめっき",
  "黒色ニッケルめっき",
  "ハードクロムめっき",
  "無電解銀めっき",
  "無電解銅めっき",
  "無電解ニッケルめっき",
  "無電解スズめっき",
  "無電解金めっき",
  "アルマイト",
  "クロメート",
  "パーカー",
  "黒染め",
  "高周波焼入れ"
]

CATEGORYS = [
  "めっき",
  "コーティング",
  "陽極酸化",
  "化成",
  "表面硬化"
]

Faker::Config.locale = 'ja'

99.times do
  name     = NAMES.sample
  category = CATEGORYS.sample
  color    = Faker::Color.color_name
  maker    = Faker::Company.name
  picture  = File.open("app/assets/images/kitten.jpg")
  Sample.create!(name: name, category: category, color: color, maker: maker, picture: picture)
end
