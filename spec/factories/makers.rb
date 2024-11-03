FactoryBot.define do
  factory :maker do
    name { "松本情報合名会社" }
    postal_code { "859-1105" }
    address { "東京都渋谷区神南1-2-3" }
    phone_number { "075-4747-2450" }
    fax_number { "075-4747-2451" }
    email { "sample_maker@example.com" }
    home_page { "https://example.com/" }
    manufacturer_rep { "池田 彩花" }
  end

  factory :maker_list, class: Maker do
    name { Faker::Company.name }
    sequence(:postal_code) { |n| "859-110#{n}" }
    sequence(:address) { |n| "東京都渋谷区神南1-2-#{n}" }
    sequence(:phone_number) { |n| "075-4747-245#{n}" }
    sequence(:fax_number) { |n| "075-4747-245#{n}" }
    sequence(:email) { |n| "sample_maker#{n}@example.com" }
    sequence(:home_page) { |n| "https://example.com/sample_maker#{n}" }
    manufacturer_rep { Faker::Name.name }
  end
end
