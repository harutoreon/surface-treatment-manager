class Category < ApplicationRecord
  has_many :samples

  validates :item, presence: { message: "（カテゴリー名）が空白です。" },
                   uniqueness: { message: "（カテゴリー名）が重複しています。" }

  validates :summary, presence: { message: '（概要）が空白です。' },
                      length: { maximum: 60, too_long: "（概要）が60文字を超えています。" }
end
