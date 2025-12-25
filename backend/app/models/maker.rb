class Maker < ApplicationRecord
  has_many :samples, dependent: :destroy

  VALID_POSTAL_CODE  = /\A\d{3}-\d{4}\z/
  VALID_PHONE_NUMBER = /\A\d{3}-\d{4}-\d{4}\z/
  VALID_FAX_NUMBER   = /\A\d{3}-\d{4}-\d{4}\z/
  VALID_EMAIL        = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  VALID_URL          = /\Ahttps?:\/\/[^\s\/$.?#].[^\s]*\z/i

  validates :name,             presence: { message: '（メーカー名）が空白です' }
  validates :postal_code,      presence: { message: '（郵便番号）が空白です' }
  validates :address,          presence: { message: '（住所）が空白です' }
  validates :phone_number,     presence: { message: '（電話番号）が空白です' }
  validates :fax_number,       presence: { message: '（FAX番号）が空白です' }
  validates :email,            presence: { message: '（メールアドレス）が空白です' }
  validates :home_page,        presence: { message: '（ホームページのアドレス）が空白です' }
  validates :manufacturer_rep, presence: { message: '（担当者）が空白です' }

  validate :postal_code_format
  validate :phone_number_format
  validate :fax_number_format
  validate :email_address_format
  validate :url_format

  scope :maker_search, -> (keyword) { where(name: keyword).take.samples }

  private

    def postal_code_format
      if postal_code.present? && postal_code !~ VALID_POSTAL_CODE
        errors.add(:postal_code, '（郵便番号）のパターンが無効です。')
      end
    end

    def phone_number_format
      if phone_number.present? && phone_number !~ VALID_PHONE_NUMBER
        errors.add(:phone_number, '（電話番号）のパターンが無効です。')
      end
    end

    def fax_number_format
      if fax_number.present? && fax_number !~ VALID_FAX_NUMBER
        errors.add(:fax_number, '（FAX番号）のパターンが無効です。')
      end
    end

    def email_address_format
      if email.present? && email !~ VALID_EMAIL
        errors.add(:email, '（メールアドレス）のパターンが無効です。')
      end
    end

    def url_format
      if home_page.present? && home_page !~ VALID_URL
        errors.add(:home_page, '（URL）のパターンが無効です。')
      end
    end
end
