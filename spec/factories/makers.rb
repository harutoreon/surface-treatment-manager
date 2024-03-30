FactoryBot.define do
  factory :maker do
    name { "松本情報合名会社" }
    postal_code { "859-1105" }
    address { "東京都渋谷区神南1-2-3" }
    phone_number { "0751-47-2450" }
    fax_number { "0751-47-2451" }
    email { "sample_maker@example.com" }
    home_page { "https://example.com/" }
    manufacturer_rep { "池田 彩花" }
  end
end
