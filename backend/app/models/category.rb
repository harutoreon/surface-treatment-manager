class Category < ApplicationRecord
  has_many :samples

  validates :item, presence: { message: "カテゴリー名が空白です" },
                   uniqueness: { message: "カテゴリー名が重複しています" }

  validates :summary, presence: { message: '概要が空白です' },
                      length: { maximum: 60, too_long: "概要が60文字を超えています" }
end
