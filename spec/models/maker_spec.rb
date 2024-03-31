require 'rails_helper'

RSpec.describe Maker, type: :model do
  describe 'validation' do
    before do
      @maker = FactoryBot.create(:maker)
    end

    describe 'valid' do
      it 'makerが有効であること' do
        expect(@maker).to be_valid
      end
    end

    describe 'presence' do
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
    end

    describe 'format' do
      describe 'postal_code' do
        context '有効な郵便番号の場合' do
          it '登録できること' do
            @maker.postal_code = '123-4567'
            expect(@maker).to be_valid
          end
        end

        context '無効な郵便番号の場合' do
          it '登録できないこと' do
            @maker.postal_code = '1234-567'
            expect(@maker).to_not be_valid
          end
        end
      end

      describe 'phone_number' do
        context '有効な電話番号の場合' do
          it '登録できること' do
            @maker.phone_number = '012-3456-7890'
            expect(@maker).to be_valid
          end
        end

        context '無効な電話番号の場合' do
          it '登録できないこと' do
            @maker.phone_number = '0123-456-7890'
            expect(@maker).to_not be_valid
          end
        end
      end

      describe 'fax_number' do
        context '有効なFAX番号の場合' do
          it '登録できること' do
            @maker.fax_number = '012-3456-7890'
            expect(@maker).to be_valid
          end
        end

        context '無効なFAX番号の場合' do
          it '登録できないこと' do
            @maker.fax_number = '0123-456-7890'
            expect(@maker).to_not be_valid
          end
        end
      end

      describe 'email' do
        context '有効なメールアドレスの場合' do
          it '登録できること' do
            @maker.email = 'user@example.com'
            expect(@maker).to be_valid
          end
        end

        context '無効なメールアドレスの場合' do
          it '登録できないこと' do
            @maker.email = 'user@example,com'
            expect(@maker).to_not be_valid
          end
        end
      end

      describe 'home_page' do
        context '有効なURLの場合' do
          it '登録できること' do
            @maker.home_page = 'https://example.com/'
            expect(@maker).to be_valid
          end
        end

        context '無効なURLの場合' do
          it '登録できないこと' do
            @maker.home_page = 'htps://www.example.com'
            expect(@maker).to_not be_valid
          end
        end
      end
    end
  end
end
