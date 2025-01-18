FactoryBot.define do
  factory :comment do
    commenter { "木下 太一" }
    department { "品質管理部" }
    body { "変寸量が一定ではありません。" }
    sample { Sample.first }
  end
end
