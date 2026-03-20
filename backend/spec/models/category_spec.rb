require 'rails_helper'

RSpec.describe Category, type: :model do
  let(:category) { FactoryBot.build(:thermal_spraying) }

  describe 'バリデーション' do
    describe '有効性の検証' do
      it 'オブジェクトが有効であること' do
        expect(category).to be_valid
      end
    end

    describe '存在性の検証' do
      it 'itemが空文字だと無効であること' do
        category.item = ''
        category.valid?
        expect(category.errors.details[:item]).to include(error: :blank)
      end

      it 'summaryが空文字だと無効であること' do
        category.summary = ''
        category.valid?
        expect(category.errors.details[:summary]).to include(error: :blank)
      end
    end

    describe '長さの検証' do
      context 'summaryの文字数が60文字以内の場合' do
        it '有効であること' do
          category.summary = 's' * 60
          expect(category).to be_valid
        end
      end

      context 'summaryの文字数が60文字を超える場合' do
        it '無効であること' do
          category.summary = 's' * 61
          category.valid?
          expect(category.errors.details[:summary].first).to include(error: :too_long)
        end
      end
    end

    describe '一意性の検証' do
      it 'itemが重複した場合、無効であること' do
        category.save
        duplicate = FactoryBot.build(:thermal_spraying, item: category.item)
        duplicate.valid?
        expect(duplicate.errors.details[:item].first).to include(error: :taken)
      end
    end
  end
end
