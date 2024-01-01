class Sample < ApplicationRecord
  validates :name,     presence: true
  validates :category, presence: true
  validates :color,    presence: true
  validates :maker,    presence: true
  mount_uploader :picture, PictureUploader
  validate :picture_size

  def self.search(search, word)
    case search
    when 'perfect'
      Sample.where('name LIKE?', "#{word}")
    when 'forward'
      Sample.where('name LIKE?', "#{word}%")
    when 'backward'
      Sample.where('name LIKE?', "%#{word}")
    when 'partial'
      Sample.where('name LIKE?', "%#{word}%")
    end
  end

  private

    def picture_size
      if picture.size > 5.megabytes
        errors.add(:picture, "should be less than 5MB")
      end
    end
end
