class Sample < ApplicationRecord
  validates :name,     presence: true
  validates :category, presence: true
  validates :color,    presence: true
  validates :maker,    presence: true
end
