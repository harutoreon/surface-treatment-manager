class Comment < ApplicationRecord
  belongs_to :sample
  validates :commenter, presence: true
  validates :body,      presence: true
end
