require 'rails_helper'

RSpec.describe Department, type: :model do
  let(:department) { FactoryBot.build(:department, name: '生産管理部') }

  describe 'バリデーション' do
    describe '有効性の検証' do
      it 'オブジェクトが有効であること' do
        expect(department).to be_valid
      end
    end

    describe '存在性の検証' do
      it 'nameが空文字だと無効であること' do
        department.name = ''
        department.valid?
        expect(department.errors.details[:name]).to include(error: :blank)
      end
    end

    describe '一意性の検証' do
      it 'nameが重複した場合、無効であること' do
        department.save
        duplicate = FactoryBot.build(:department, name: department.name)
        duplicate.valid?
        expect(duplicate.errors.details[:name].first).to include(error: :taken)
      end
    end
  end
end
