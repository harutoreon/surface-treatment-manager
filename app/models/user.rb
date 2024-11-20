class User < ApplicationRecord
  has_secure_password validations: false

  validates :name,                  presence: { message: '（ユーザー名）が空白です。' }
  validates :department,            presence: { message: '（部署名）が空白です。' }
  validates :password,              presence: { message: '（パスワード）が空白です。' }
  validates :password_confirmation, presence: { message: '（パスワードの確認）が空白です。' }

  validate :name_length
  validate :password_length
  validate :password_comparison

  scope :displayable, -> { User.where.not(name: ['admin user', 'general user']) }

  private

    def name_length
      if name.length > 50
        errors.add(:name, '（ユーザー名）は 50 文字以内で入力して下さい。')
      end
    end

    def password_length
      if password.present? && password.length < 6
        errors.add(:password, '（パスワード）は 6 文字以上で入力して下さい。')
      end
    end

    def password_comparison
      if password.present? && password_confirmation.present?
        if password != password_confirmation
          errors.add(:password_confirmation, '（パスワードの組み合わせ）が不正です。')
        end
      end
    end
end
