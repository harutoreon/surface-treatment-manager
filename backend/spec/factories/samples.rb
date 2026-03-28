FactoryBot.define do
  factory :sample do
    name { "無電解ニッケルめっき" }
    color { "コールド" }
    image { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
    hardness { '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度' }
    film_thickness { '通常は3～5μm、厚めの場合は20～50μmまで可能' }
    feature { '耐食性・耐摩耗性・耐薬品性・耐熱性' }
    summary { '電気を使わず化学反応で金属表面にニッケルを析出する技術です。' }
    maker
    category
  end
end
