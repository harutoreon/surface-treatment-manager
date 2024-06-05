class Maker < ApplicationRecord
  VALID_POSTAL_CODE  = /\A\d{3}-\d{4}\z/
  VALID_PHONE_NUMBER = /\A\d{3}-\d{4}-\d{4}\z/
  VALID_FAX_NUMBER   = /\A\d{3}-\d{4}-\d{4}\z/
  VALID_EMAIL        = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  VALID_URL          = /\Ahttps?:\/\/[^\s\/$.?#].[^\s]*\z/i

  validates :name,             presence: true
  validates :postal_code,      presence: true, format: { with: VALID_POSTAL_CODE }
  validates :address,          presence: true
  validates :phone_number,     presence: true, format: { with: VALID_PHONE_NUMBER }
  validates :fax_number,       presence: true, format: { with: VALID_FAX_NUMBER }
  validates :email,            presence: true, format: { with: VALID_EMAIL }
  validates :home_page,        presence: true, format: { with: VALID_URL }
  validates :manufacturer_rep, presence: true
end
