require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { FactoryBot.build(:user) }

  describe '有効性の検証' do
    it 'オブジェクトが有効であること' do
      expect(user).to be_valid
    end
  end

  describe '存在性の検証' do
    it 'nameが空文字だと無効であること' do
      user.name = ''
      user.valid?
      expect(user.errors.details[:name]).to include(error: :blank)
    end

    it 'departmentが空文字だと無効であること' do
      user.department = ''
      user.valid?
      expect(user.errors.details[:department]).to include(error: :blank)
    end
  end

  describe '長さの検証' do
    context 'nameの文字数が50文字以下の場合' do
      it '有効であること' do
        user.name = 's' * 50
        user.valid?
        expect(user).to be_valid
      end
    end

    context 'nameの文字数が50文字を超える場合' do
      it '無効であること' do
        user.name = 's' * 51
        user.valid?
        expect(user.errors.details[:name]).to include(count: 50, error: :too_long)
      end
    end

    context 'passwordの文字数が6文字以下の場合' do
      it '無効であること' do
        user.password = user.password_confirmation = 's' * 5
        user.valid?
        expect(user.errors.details[:password]).to include(count: 6, error: :too_short)
      end
    end

    context 'passwordの文字数が6文字を超える場合' do
      it '有効であること' do
        user.password = user.password_confirmation = 's' * 6
        user.valid?
        expect(user).to be_valid
      end
    end
  end

  describe '一致の検証' do
    it 'パスワードと確認用パスワードが一致しない場合は無効であること' do
      user.password, user.password_confirmation = 'foobar', 'foobaz'
      expect(user).to be_invalid
    end
  end

  describe '.displayable' do
    let!(:target_user) { FactoryBot.create(:user, name: 'normal user') }
    let!(:admin) { FactoryBot.create(:admin_user) }
    let!(:general) { FactoryBot.create(:general_user) }

    it 'adminとgeneralは除外されること' do
      users = User.displayable
      expect(users).to include(target_user)
      expect(users).not_to include(admin, general)
    end
  end
end
