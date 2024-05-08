class Sample < ApplicationRecord
  has_many :comments, dependent: :destroy

  validates :name,     presence: true
  validates :category, presence: true
  validates :color,    presence: true
  validates :maker,    presence: true
  validates :picture,  presence: true
  validate  :picture_size
  mount_uploader :picture, PictureUploader

  validates :hardness,       presence: true
  validates :film_thickness, presence: true
  validates :feature,        presence: true

  scope :name_search,     -> (keyword)    { where('name LIKE ?',     "%#{keyword}%") }
  scope :category_search, -> (selectword) { where('category LIKE ?', "%#{selectword}%") }
  scope :maker_search,    -> (keyword)    { where('maker LIKE ?',    "%#{keyword}%") }

  private

    def picture_size
      if picture.size > 5.megabytes
        errors.add(:picture, "should be less than 5MB")
      end
    end
end
