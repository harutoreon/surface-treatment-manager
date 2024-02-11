FactoryBot.define do
  factory :sample do
    name { "無電解ニッケルめっき" }
    category { "めっき" }
    color { "コールド" }
    maker { "ヘッティンガー株式会社" }
    picture { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
  end

  factory :sample_list, class: Sample do
    name { "無電解ニッケルめっき" }
    category { "めっき" }
    color { "ゴールド" }
    maker { "ヘッティンガー株式会社" }
    picture { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
  end

  factory :valid_search_sample, class: Sample do
    name { "白アルマイト" }
    category { "陽極酸化" }
    color { "ホワイト" }
    maker { "有限会社村田保険" }
    picture { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
  end

  factory :invalid_search_sample, class: Sample do
    name { "黒クロメート" }
    category { "化成" }
    color { "ブラック" }
    maker { "株式会社中川鉱業" }
    picture { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
  end
end
