require 'rails_helper'

RSpec.describe Maker, type: :model do
  describe 'validation' do
    before do
      @maker = FactoryBot.build(:maker)
    end

    it 'makerが有効であること' do
      expect(@maker).to be_valid
    end

    it 'nameが存在すること' do
      @maker.name = ''
      expect(@maker).to_not be_valid
    end

    it 'postal_codeが存在すること' do
      @maker.postal_code = ''
      expect(@maker).to_not be_valid
    end

    it 'addressが存在すること' do
      @maker.address = ''
      expect(@maker).to_not be_valid
    end

    it 'phone_numberが存在すること' do
      @maker.phone_number = ''
      expect(@maker).to_not be_valid
    end

    it 'fax_numberが存在すること' do
      @maker.fax_number = ''
      expect(@maker).to_not be_valid
    end

    it 'emailが存在すること' do
      @maker.email = ''
      expect(@maker).to_not be_valid
    end

    it 'home_pageが存在すること' do
      @maker.home_page = ''
      expect(@maker).to_not be_valid
    end

    it 'manufacturer_repが存在すること' do
      @maker.manufacturer_rep = ''
      expect(@maker).to_not be_valid
    end

    it '無効な郵便番号は登録できないこと' do
      @maker.postal_code = '1234-567'
      expect(@maker).to_not be_valid
    end

    it '無効な電話番号は登録できないこと' do
      @maker.phone_number = '0123-456-7890'
      expect(@maker).to_not be_valid
    end

    it '無効なFAX番号は登録できないこと' do
      @maker.fax_number = '0123-456-7890'
      expect(@maker).to_not be_valid
    end

    it '無効なメールアドレスは登録できないこと' do
      @maker.email = 'user@example,com'
      expect(@maker).to_not be_valid
    end

    it '無効なホームページアドレスは登録できないこと' do
      @maker.home_page = 'htps://www.example.com'
      expect(@maker).to_not be_valid
    end
  end
end
