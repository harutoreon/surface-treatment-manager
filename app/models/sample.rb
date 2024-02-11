class Sample < ApplicationRecord
  validates :name,     presence: true
  validates :category, presence: true
  validates :color,    presence: true
  validates :maker,    presence: true
  validates :picture,  presence: true, allow_nil: true
  validate  :picture_size
  mount_uploader :picture, PictureUploader

  scope :search, -> (search, word) do
    scope :perfect_search,  -> { where('name LIKE ?', "#{word}") }
    scope :forward_search,  -> { where('name LIKE ?', "#{word}%") }
    scope :backward_search, -> { where('name LIKE ?', "%#{word}") }
    scope :partial_search,  -> { where('name LIKE ?', "%#{word}%") }
    send("#{search}_search")
  end

  scope :name_search,     -> (keyword) { where('name LIKE ?',     "%#{keyword}%") }
  scope :category_search, -> (keyword) { where('category LIKE ?', "%#{keyword}%") }
  scope :maker_search,    -> (keyword) { where('maker LIKE ?',    "%#{keyword}%") }

  private

    def picture_size
      if picture.size > 5.megabytes
        errors.add(:picture, "should be less than 5MB")
      end
    end
end
