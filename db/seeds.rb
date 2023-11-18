# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

99.times do
  name = ["無電解ニッケルめっき", "ハードクロムめっき", "アルマイト"].sample
  category = ["めっき", "コーティング", "陽極酸化"].sample
  color = Faker::Color.color_name
  maker = Faker::Company.name
  Sample.create!(name: name, category: category, color: color, maker: maker)
end
