FactoryBot.define do
  factory :category do
    item { "めっき" }
    summary { "金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。" }
  end

  factory :thermal_spraying, class: Category do
    item { "溶射" }
    summary { "金属やセラミックスなどの材料を熱で溶融・軟化させ、高速で基材表面に吹き付けて皮膜を形成する表面処理技術です。" }
  end
end
