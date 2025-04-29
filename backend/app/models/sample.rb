class Sample < ApplicationRecord
  include Rails.application.routes.url_helpers
  
  has_many :comments, dependent: :destroy
  has_one_attached :image

  validates :name,     presence: { message: '（処理名）が空白です。' }
  validates :category, presence: { message: '（カテゴリー）が空白です。' }
  validates :color,    presence: { message: '（色調）が空白です。' }
  validates :maker,    presence: { message: '（メーカー）が空白です。' }
  validates :image,    presence: { message: '（画像）がありません。' }

  validates :hardness,       presence: { message: '（硬度）が空白です。' }
  validates :film_thickness, presence: { message: '（膜厚）が空白です。' }
  validates :feature,        presence: { message: '（特徴）が空白です。' }

  scope :name_search,     -> (keyword)    { where('name LIKE ?',     "%#{keyword}%") }
  scope :category_search, -> (selectword) { where('category LIKE ?', "%#{selectword}%") }
  scope :maker_search,    -> (keyword)    { where('maker LIKE ?',    "%#{keyword}%") }

  def image_url
    image.attached? ? url_for(image) : nil  
  end
end
