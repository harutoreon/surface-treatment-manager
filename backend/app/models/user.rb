class User < ApplicationRecord
  has_secure_password

  has_many :comments, dependent: :destroy

  validates :name,
    presence: { message: 'ユーザー名が空白です。' },
    length: { maximum: 50, too_long: 'ユーザー名は 50 文字以内で入力して下さい' }

  validates :department,
    presence: { message: '部署名が空白です' }

  validates :password,
    presence: { message: 'パスワードが空白です' },
    length: { minimum: 6, too_short: 'パスワードは6文字以上で入力して下さい' },
    allow_nil: true

  scope :displayable, -> { User.where.not(name: ['admin user', 'general user']) }
end
