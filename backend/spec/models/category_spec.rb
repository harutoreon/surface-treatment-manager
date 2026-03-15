require 'rails_helper'

RSpec.describe Category, type: :model do
  let(:category) { FactoryBot.build(:thermal_spraying) }

  describe '有効性の検証' do
    it 'オブジェクトが有効であること' do
      expect(category).to be_valid
    end
  end

  describe '存在性の検証' do
    it 'itemが空文字だと無効であること' do
      category.item = ''
      expect(category).to be_invalid
      expect(category.errors[:item]).to include('（カテゴリー名）が空白です。')
    end

    it 'summaryが空文字だと無効であること' do
      category.summary = ''
      expect(category).to be_invalid
      expect(category.errors[:summary]).to include('（概要）が空白です。')
    end
  end

  describe '長さの検証' do
    context '文字数が60文字以下の場合' do
      it '有効であること' do
        category.summary = 's' * 60
        expect(category).to be_valid
      end
    end

    context '文字数が60文字を超える場合' do
      it '無効であること' do
        category.summary = 's' * 61
        expect(category).to be_invalid
        expect(category.errors[:summary]).to include('（概要）が60文字を超えています。')
      end
    end
  end

  describe '一意性の検証' do
    it 'itemが重複した場合、無効であること' do
      category.save
      duplicate = FactoryBot.build(:thermal_spraying, item: category.item)
      expect(duplicate).to be_invalid
    end
  end
end
