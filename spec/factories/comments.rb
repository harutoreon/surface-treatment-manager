FactoryBot.define do
  factory :comment do
    commenter { "木下 太一" }
    body { "変寸量が一定ではありません。" }
    sample { FactoryBot.create(:sample) }
    # association :sample
  end
end
