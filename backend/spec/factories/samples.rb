FactoryBot.define do
  factory :sample do
    name { "無電解ニッケルめっき" }
    category { "めっき" }
    color { "コールド" }
    image { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
    hardness { '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度' }
    film_thickness { '通常は3～5μm、厚めの場合は20～50μmまで可能' }
    feature { '耐食性・耐摩耗性・耐薬品性・耐熱性' }
    summary { '電気を使わず化学反応で金属表面にニッケルを析出する技術です。' }
    maker { Maker.first }
  end

  factory :sample_list, class: Sample do
    name { "無電解ニッケルめっき" }
    category { "めっき" }
    color { "ゴールド" }
    image { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
    hardness { '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度' }
    film_thickness { '通常は3～5μm、厚めの場合は20～50μmまで可能' }
    feature { '耐食性・耐摩耗性・耐薬品性・耐熱性' }
    summary { '電気を使わず化学反応で金属表面にニッケルを析出する技術です。' }
    maker { Maker.first }
  end

  factory :anodised_aluminium, class: Sample do
    name { "白アルマイト" }
    category { "陽極酸化" }
    color { "ホワイト" }
    image { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
    hardness { 'Hv200程度' }
    film_thickness { '5〜10µm程度' }
    feature { '電気絶縁性・耐食性・耐摩耗性' }
    summary { 'アルミ表面に白色の酸化皮膜を生成する表面処理技術です。' }
    maker { Maker.first }
  end

  factory :chromate, class: Sample do
    name { "黒クロメート" }
    category { "化成" }
    color { "ブラック" }
    image { Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) }
    hardness { 'Hv200～350程度' }
    film_thickness { '0.1～3μm程度' }
    feature { '導電性・耐傷性・絶縁性・耐食性' }
    summary { '亜鉛めっきや鋼に黒色クロメート皮膜を形成する技術です。' }
    maker { Maker.first }
  end
end
