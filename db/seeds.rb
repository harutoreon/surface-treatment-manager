Faker::Config.locale = 'ja'

99.times do
  name = ["無電解ニッケルめっき", "ハードクロムめっき", "アルマイト"].sample
  category = ["めっき", "コーティング", "陽極酸化"].sample
  color = Faker::Color.color_name
  maker = Faker::Company.name
  picture = File.open('app/assets/images/kitten.jpg')
  Sample.create!(name: name, category: category, color: color, maker: maker, picture: picture)
end
