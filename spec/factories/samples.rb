FactoryBot.define do
  factory :sample do
    name { "無電解ニッケルめっき" }
    category { "めっき" }
    color { "コールド" }
    maker { "ヘッティンガー株式会社" }
    picture { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
    hardness { '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度' }
    film_thickness { '通常は3～5μm、厚めの場合は20～50μmまで可能' }
    feature { '耐食性・耐摩耗性・耐薬品性・耐熱性' }
  end

  factory :sample_list, class: Sample do
    name { "無電解ニッケルめっき" }
    category { "めっき" }
    color { "ゴールド" }
    maker { "ヘッティンガー株式会社" }
    picture { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
  end

  factory :anodised_aluminium, class: Sample do
    name { "白アルマイト" }
    category { "陽極酸化" }
    color { "ホワイト" }
    maker { "有限会社村田保険" }
    picture { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
  end

  factory :chromate, class: Sample do
    name { "黒クロメート" }
    category { "化成" }
    color { "ブラック" }
    maker { "株式会社中川鉱業" }
    picture { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
  end
end
