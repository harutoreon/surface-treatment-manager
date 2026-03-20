class Comment < ApplicationRecord
  belongs_to :sample
  belongs_to :user

  validates :commenter,  presence: { message: "投稿者名が空白です。" }
  validates :department, presence: { message: "部署名が空白です。" }
  validates :body,       presence: { message: "コメント本文が空白です。" }
end
