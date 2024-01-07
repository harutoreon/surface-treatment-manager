class User < ApplicationRecord
  validates :name,                  presence: true, length: { maximum: 50 }
  validates :password,              presence: true, length: { minimum: 6 }
  validates :password_confirmation, presence: true

  has_secure_password
end
