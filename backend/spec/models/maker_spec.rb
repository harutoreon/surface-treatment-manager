require 'rails_helper'

RSpec.describe Maker, type: :model do
  describe 'バリデーション' do
    let(:maker) { FactoryBot.build(:maker) }

    describe '有効性の検証' do
      it 'オブジェクトが有効であること' do
        expect(maker).to be_valid
      end
    end

    describe '存在性の検証' do
      it 'nameが空文字だと無効であること' do
        maker.name = ''
        maker.valid?
        expect(maker.errors.details[:name]).to include(error: :blank)
      end

      it 'postal_codeが空文字だと無効であること' do
        maker.postal_code = ''
        maker.valid?
        expect(maker.errors.details[:postal_code]).to include(error: :blank)
      end

      it 'addressが空文字だと無効であること' do
        maker.address = ''
        maker.valid?
        expect(maker.errors.details[:address]).to include(error: :blank)
      end

      it 'phone_numberが空文字だと無効であること' do
        maker.phone_number = ''
        maker.valid?
        expect(maker.errors.details[:phone_number]).to include(error: :blank)
      end

      it 'fax_numberが空文字だと無効であること' do
        maker.fax_number = ''
        maker.valid?
        expect(maker.errors.details[:fax_number]).to include(error: :blank)
      end

      it 'emailが空文字だと無効であること' do
        maker.email = ''
        maker.valid?
        expect(maker.errors.details[:email]).to include(error: :blank)
      end

      it 'home_pageが空文字だと無効であること' do
        maker.home_page = ''
        maker.valid?
        expect(maker.errors.details[:home_page]).to include(error: :blank)
      end

      it 'manufacturer_repが空文字だと無効であること' do
        maker.manufacturer_rep = ''
        maker.valid?
        expect(maker.errors.details[:manufacturer_rep]).to include(error: :blank)
      end
    end

    describe 'フォーマットの検証' do
      it '無効な郵便番号は登録できないこと' do
        maker.postal_code = '1234-567'
        maker.valid?
        expect(maker.errors.details[:postal_code].first).to include(error: :invalid)
      end

      it '無効な電話番号は登録できないこと' do
        maker.phone_number = '0123-456-7890'
        maker.valid?
        expect(maker.errors.details[:phone_number].first).to include(error: :invalid)
      end

      it '無効なFAX番号は登録できないこと' do
        maker.fax_number = '0123-456-7890'
        maker.valid?
        expect(maker.errors.details[:fax_number].first).to include(error: :invalid)
      end

      it '無効なメールアドレスは登録できないこと' do
        maker.email = 'user@example,com'
        maker.valid?
        expect(maker.errors.details[:email].first).to include(error: :invalid)
      end

      it '無効なホームページアドレスは登録できないこと' do
        maker.home_page = 'htps://www.example.com'
        maker.valid?
        expect(maker.errors.details[:home_page].first).to include(error: :invalid)
      end
    end
  end

  describe 'スコープ' do
    describe '.maker_search' do
      let!(:sample) { FactoryBot.create(:sample) }  # メーカーも同時に生成される

      before do
        maker = Maker.find(sample.maker_id)
        maker.name = 'valid-maker-name'
        maker.save
      end

      context '有効なメーカー名の場合' do
        it 'サンプルが1件返ること' do
          expect(Maker.maker_search('valid-maker-name').count).to eq(1)
        end
      end

      context '無効なメーカー名の場合' do
        it '空の配列が返ること' do
          expect(Maker.maker_search('invalid-maker-name')).to be_empty
        end
      end
    end
  end
end
