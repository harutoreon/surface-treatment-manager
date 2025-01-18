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
    postal_code { "859-1101" }
    address { "東京都渋谷区神南1-2-2" }
    phone_number { "075-4747-2453" }
    fax_number { "075-4747-2454" }
    email { "sample_maker@example.com" }
    home_page { "https://example.com/sample_maker" }
    manufacturer_rep { Faker::Name.name }
  end
end
