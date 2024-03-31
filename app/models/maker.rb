class Maker < ApplicationRecord
  VALID_POSTAL_CODE  = /\d{3}-\d{4}/
  VALID_PHONE_NUMBER = /\d{3}-\d{4}-\d{4}/
  VALID_FAX_NUMBER   = /\d{3}-\d{4}-\d{4}/
  VALID_EMAIL        = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  VALID_URL          = /https?:\/\/[^\s\/$.?#].[^\s]*/i

  validates :name,             presence: true
  validates :postal_code,      presence: true, format: { with: VALID_POSTAL_CODE }
  validates :address,          presence: true
  validates :phone_number,     presence: true, format: { with: VALID_PHONE_NUMBER }
  validates :fax_number,       presence: true, format: { with: VALID_FAX_NUMBER }
  validates :email,            presence: true, format: { with: VALID_EMAIL }
  validates :home_page,        presence: true, format: { with: VALID_URL }
  validates :manufacturer_rep, presence: true
end
