class Maker < ApplicationRecord
  has_many :samples, dependent: :destroy

  VALID_POSTAL_CODE  = /\A\d{3}-\d{4}\z/
  VALID_PHONE_NUMBER = /\A\d{3}-\d{4}-\d{4}\z/
  VALID_FAX_NUMBER   = /\A\d{3}-\d{4}-\d{4}\z/
  VALID_EMAIL        = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  VALID_URL          = /\Ahttps?:\/\/[^\s\/$.?#].[^\s]*\z/i

  validates :name,
    presence: { message: 'メーカー名が空白です' }

  validates :postal_code,
    presence: { message: '郵便番号が空白です' },
    format: { with: VALID_POSTAL_CODE, message: '郵便番号のパターンが無効です。' }

  validates :address,
    presence: { message: '住所が空白です' }

  validates :phone_number,
    presence: { message: '電話番号が空白です' },
    format: { with: VALID_PHONE_NUMBER, message: '電話番号のパターンが無効です。' }

  validates :fax_number,
    presence: { message: 'FAX番号が空白です' },
    format: { with: VALID_FAX_NUMBER, message: 'FAX番号のパターンが無効です。' }

  validates :email,
    presence: { message: 'メールアドレスが空白です' },
    format: { with: VALID_EMAIL, message: 'メールアドレスのパターンが無効です。' }

  validates :home_page,
    presence: { message: 'ホームページのアドレスが空白です' },
    format: { with: VALID_URL, message: 'URLのパターンが無効です。' }

  validates :manufacturer_rep,
    presence: { message: '担当者が空白です' }

  scope :maker_search, ->(keyword) {
    Sample.joins(:maker).where(makers: { name: keyword })
  }
end
