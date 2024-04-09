class Category < ApplicationRecord
  validates :item,    presence: true, uniqueness: true
  validates :summary, presence: true, length: { maximum: 60 }
end
