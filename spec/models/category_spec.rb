require 'rails_helper'

RSpec.describe Category, type: :model do
  describe 'validation' do
    let(:category) { FactoryBot.create(:category) }

    it 'カテゴリが有効であること' do
      expect(category).to be_valid
    end

    it 'itemが存在すること' do
      category.item = ''
      expect(category).to_not be_valid
    end

    it 'itemの重複がないこと' do
      duplicate_category = category.dup
      expect(duplicate_category).to_not be_valid
    end
  end
end
