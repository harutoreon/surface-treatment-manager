FactoryBot.define do
  factory :sample do
    name { "無電解ニッケルめっき" }
    category { "めっき" }
    color { "コールド" }
    maker { "ヘッティンガー株式会社" }
  end

  factory :sample_list, class: Sample do
    name { "無電解ニッケルめっき" }
    category { "めっき" }
    color { "ゴールド" }
    maker { "ヘッティンガー株式会社" }
  end
end
