class User < ApplicationRecord
  validates :name,                  presence: true, length: { maximum: 50 }
  validates :password,              presence: true, length: { minimum: 6 }, allow_nil: true

  has_secure_password

  def self.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end
end
