Faker::Config.locale = 'ja'

User.create!(name: "Example User", password: "foobar", password_confirmation: "foobar", admin: true)
User.create!(name: "Sample User", password: "foobaz", password_confirmation: "foobaz")

SAMPLES = [
  { name: "無電解ニッケルめっき", category: "めっき", color: "イエローブラウンシルバー", picture: "electroless_nickel_plating" },
  { name: "白銀めっき", category: "めっき", color: "シルバー", picture: "white_silver_plating" },
  { name: "金めっき", category: "めっき", color: "ゴールド", picture: "gold_plate" },
  { name: "銀めっき", category: "めっき", color: "シルバー", picture: "silver_plating" },
  { name: "銅めっき", category: "めっき", color: "ブロンズ", picture: "copper_plating" },
  { name: "亜鉛めっき", category: "めっき", color: "シルバー", picture: "zinc_plating" },
  { name: "錫めっき", category: "めっき", color: "ホワイトシルバー", picture: "tin_plating" },
  { name: "ニッケルめっき", category: "めっき", color: "ライトシルバー", picture: "nickel_plating" },
  { name: "クロムめっき", category: "めっき", color: "シルバー", picture: "chrome_plating" },
  { name: "黒色クロムめっき", category: "めっき", color: "マットブラック", picture: "black_chrome_plating" },
  { name: "白アルマイト", category: "陽極酸化", color: "ホワイト", picture: "white_anodized_aluminum" },
  { name: "黒アルマイト", category: "陽極酸化", color: "ブラック", picture: "black_anodized_aluminum" },
  { name: "硬質アルマイト", category: "陽極酸化", color: "ダークブラウン", picture: "hard_anodized_aluminum" },
  { name: "ユニクロクロメート", category: "化成", color: "シルバー", picture: "unichromate" },
  { name: "有色クロメート", category: "化成", color: "イエローブラウン", picture: "colored_chromate" },
  { name: "黒クロメート", category: "化成", color: "ブラック", picture: "black_chromate" },
  { name: "緑クロメート", category: "化成", color: "オリーブ", picture: "green_chromate" },
  { name: "四三酸化鉄皮膜", category: "化成", color: "ブラック", picture: "iron_tetroxide_film" },
  { name: "パーカー", category: "化成", color: "ブラック", picture: "hooded sweatshirt" },
  { name: "TiN", category: "コーティング", color: "ゴールド", picture: "titanium_coating" },
  { name: "TiCN", category: "コーティング", color: "グレー", picture: "titanium_ceramic_coating" },
  { name: "TiAlN", category: "コーティング", color: "ダークバイオレット", picture: "titanium_aluminum_coating" },
  { name: "AlCrN", category: "コーティング", color: "ダークグレー", picture: "aluminum_chrome_coating" },
  { name: "CrN", category: "コーティング", color: "シルバーグレー", picture: "chromium_nitride_coating" },
  { name: "DLC", category: "コーティング", color: "ブラック", picture: "diamond_like_carbon" },
  { name: "ブラスト", category: "表面硬化", color: "メタリックグレー", picture: "blast" },
  { name: "WPC", category: "表面硬化", color: "グレー", picture: "wonder_process_craft" },
  { name: "レイデント", category: "めっき", color: "ブラック", picture: "raident" },
  { name: "パルソナイト", category: "表面硬化", color: "グレー", picture: "palsonite" },
  { name: "タフトライド", category: "表面硬化", color: "グレー", picture: "tufted_ride" },
  { name: "キリンコートS", category: "表面硬化", color: "メタリックグレー", picture: "kirin_coat_s" },
  { name: "カナック", category: "表面硬化", color: "ブラウン", picture: "canac" }
]

SAMPLES.each do |sample|
  Sample.create!(name: sample[:name],
                 category: sample[:category],
                 color: sample[:color],
                 maker: Faker::Company.name,
                 picture: File.open("app/assets/images/#{sample[:picture]}.jpeg"))
end
