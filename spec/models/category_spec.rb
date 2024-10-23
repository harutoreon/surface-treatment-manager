require 'rails_helper'

RSpec.describe Category, type: :model do
  describe 'validation' do
    before do
      @category = FactoryBot.build(:category)
    end

    it 'カテゴリが有効であること' do
      expect(@category).to be_valid
    end

    it 'itemが存在すること' do
      @category.item = ''
      expect(@category).to_not be_valid
    end

    it 'summaryが存在すること' do
      @category.summary = ''
      expect(@category).to_not be_valid
    end

    it 'itemの重複がないこと' do
      @category.save
      duplicate_category = @category.dup
      expect(duplicate_category).to_not be_valid
    end

    it 'summaryの長さが60文字以内であること' do
      @category.summary = 's' * 61
      expect(@category).to_not be_valid
    end
  end
end
