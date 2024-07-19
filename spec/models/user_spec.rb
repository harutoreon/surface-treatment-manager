require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validation' do
    it 'userが有効であること' do
      user = FactoryBot.build(:user)
      expect(user).to be_valid
    end

    it 'nameが存在すること' do
      user = FactoryBot.build(:user, name: '')
      expect(user).to_not be_valid
    end

    it 'nameは50文字以下であること' do
      user = FactoryBot.build(:user, name: 's' * 51)
      expect(user).to_not be_valid
    end

    it 'departmentが存在すること' do
      user = FactoryBot.build(:user, department: '')
      expect(user).to_not be_valid
    end

    it 'パスワードが空白でないこと' do
      user = FactoryBot.build(:user, password: '', password_confirmation: '')
      expect(user).to_not be_valid
    end

    it 'パスワードが6文字以上であること' do
      user = FactoryBot.build(:user, password: 's' * 5, password_confirmation: 's' * 5)
      expect(user).to_not be_valid
    end
  end
end
