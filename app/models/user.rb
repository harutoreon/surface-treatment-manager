class User < ApplicationRecord
  has_secure_password validations: false

  validates :name,       presence: { message: '（名前）が空白です。' }, length: { maximum: 50, too_long: '（名前）が50文字を超えています。' }
  validates :department, presence: { message: '（部署名）が空白です。' }
  validates :password,   presence: { message: '（パスワード）が空白です。' }, length: { minimum: 6, too_short: '（パスワード）は6文字以上で入力して下さい。' }
end
