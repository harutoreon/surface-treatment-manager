class Comment < ApplicationRecord
  belongs_to :sample
  belongs_to :user

  validates :commenter,  presence: { message: "（投稿者名）が空白です。" }
  validates :department, presence: { message: "（部署名）が空白です。" }
  validates :body,       presence: { message: "（コメント本文）が空白です。" }
end
