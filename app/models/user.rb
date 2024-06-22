class User < ApplicationRecord
  validates :name,     presence: true, length: { maximum: 50 }
  validates :password, presence: true, length: { minimum: 6 }, allow_nil: true
  has_secure_password
end
