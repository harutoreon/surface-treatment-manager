class Category < ApplicationRecord
  validates :item, presence: true, uniqueness: true
end
