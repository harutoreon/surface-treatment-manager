class Maker < ApplicationRecord
  validates :name,             presence: true
  validates :postal_code,      presence: true
  validates :address,          presence: true
  validates :phone_number,     presence: true
  validates :fax_number,       presence: true
  validates :email,            presence: true
  validates :home_page,        presence: true
  validates :manufacturer_rep, presence: true
end
