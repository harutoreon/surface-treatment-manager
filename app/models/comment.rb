class Comment < ApplicationRecord
  belongs_to :sample
  validates :commenter,  presence: true
  validates :department, presence: true
  validates :body,       presence: true
end
