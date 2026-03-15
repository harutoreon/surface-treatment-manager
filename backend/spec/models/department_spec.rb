require 'rails_helper'

RSpec.describe Department, type: :model do
  let(:department) { FactoryBot.build(:department, name: '生産管理部') }

  describe '有効性の検証' do
    it 'オブジェクトが有効であること' do
      expect(department).to be_valid
    end
  end

  describe '存在性の検証' do
    it 'nameが空文字だと無効であること' do
      department.name = ''
      expect(department).to be_invalid
      expect(department.errors[:name]).to include('部署名が空白です。')
    end
  end

  describe '一意性の検証' do
    it 'nameが重複した場合、無効であること' do
      department.save
      duplicate = FactoryBot.build(:department, name: department.name)
      expect(duplicate).to be_invalid
      expect(duplicate.errors[:name]).to include('部署名が重複しています。')
    end
  end
end
