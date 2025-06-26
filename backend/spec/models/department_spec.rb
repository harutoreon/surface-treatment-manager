require 'rails_helper'

RSpec.describe Department, type: :model do
  describe 'validation' do
    before do
      @department = FactoryBot.build(:department)
    end

    it 'nameが存在すること' do
      @department.name = ''
      expect(@department).to_not be_valid
    end

    it 'nameの重複がないこと' do
      @department.save
      duplicate_department = @department.dup
      expect(duplicate_department).to_not be_valid
    end
  end
end
