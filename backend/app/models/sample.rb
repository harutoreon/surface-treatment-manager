class Sample < ApplicationRecord
  include Rails.application.routes.url_helpers

  belongs_to :maker
  belongs_to :category
  has_many :comments, dependent: :destroy
  has_one_attached :image

  validates :name,
    presence: { message: '処理名が空白です' }

  validates :color,
    presence: { message: '色調が空白です' }

  validates :image,
    presence: { message: '画像がありません' }

  validates :hardness,
    presence: { message: '硬度が空白です' }

  validates :film_thickness,
    presence: { message: '膜厚が空白です' }

  validates :feature,
    presence: { message: '特徴が空白です' }

  validates :summary,
    presence: { message: '概要が空白です' },
    length:   { maximum: 50, message: '概要は50文字以内です' }

  scope :name_search, -> (keyword) { where('name LIKE ?', "%#{keyword}%") }

  def image_url
    image.attached? ? url_for(image) : nil  
  end

  def self.with_image_url
    samples = Sample.order(:id).select(:id, :name, :summary)
    samples.map do |sample|
      sample.as_json(methods: :image_url)
    end
  end
end
