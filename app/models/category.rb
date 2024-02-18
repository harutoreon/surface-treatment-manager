class Category < ApplicationRecord
  validates :item, presence: true
end
