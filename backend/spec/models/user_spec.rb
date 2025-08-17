require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validation' do
    before do
      @user = FactoryBot.build(:user)
    end

    it 'userが有効であること' do
      expect(@user).to be_valid
    end

    it 'nameが存在すること' do
      @user.name = ''
      expect(@user).to_not be_valid
    end

    it 'nameは50文字以下であること' do
      @user.name = 's' * 51
      expect(@user).to_not be_valid
    end

    it 'departmentが存在すること' do
      @user.department = ''
      expect(@user).to_not be_valid
    end

    it 'パスワードが空白でないこと' do
      @user.password = ''
      @user.password_confirmation = ''
      expect(@user).to_not be_valid
    end

    it 'パスワードが6文字以上であること' do
      @user.password = 's' * 5
      @user.password_confirmation = 's' * 5
      expect(@user).to_not be_valid
    end

    it 'パスワードの組み合わせが正常であること' do
      @user.password = 'foobar'
      @user.password_confirmation = 'foobaz'
      expect(@user).to_not be_valid
    end
  end

  describe 'scope' do
    describe '.displayable' do
      before do
        FactoryBot.create_list(:user_list, 28)
        FactoryBot.create(:admin_user)
        FactoryBot.create(:general_user)
      end

      it '管理者ユーザーが含まれないこと' do
        users = User.displayable
        expect(users.find_by(name: 'admin user')).to be_nil
      end

      it '一般ユーザーが含まれないこと' do
        users = User.displayable
        expect(users.find_by(name: 'general user')).to be_nil
      end
    end
  end
end
