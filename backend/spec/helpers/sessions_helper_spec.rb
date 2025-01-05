require 'rails_helper'

RSpec.describe SessionsHelper, type: :helper do
  describe '#log_in' do
    before do
      @user = FactoryBot.create(:user)
    end

    context '有効な値の場合' do
      it 'セッションのuser_idに値があること' do
        log_in(@user)
        expect(session[:user_id]).to eq(@user.id)
      end
    end

    context '無効な値の場合' do
      before do
        @other = FactoryBot.build(:user, name: 'Alice')
      end

      it 'セッションのuser_idがnilであること' do
        log_in(@other)
        expect(session[:user_id]).to be_nil
      end
    end
  end

  describe '#current_user?' do
    before do
      @logged_in_user = FactoryBot.create(:user)
      @not_logged_in_user = FactoryBot.create(:michael)
      log_in(@logged_in_user)
    end

    context '有効な値の場合' do
      it 'trueが返ること' do
        expect(current_user?(@logged_in_user)).to eq(true)
      end
    end

    context '無効な値の場合' do
      it 'falseが返ること' do
        expect(current_user?(@not_logged_in_user)).to eq(false)
      end
    end
  end

  describe '#current_user' do
    before do
      @user = FactoryBot.create(:user)
    end

    context 'ログインしている場合' do
      it 'ユーザーが返ること' do
        log_in(@user)
        expect(current_user).to eq(@user)
      end
    end

    context '未ログインの場合' do
      it 'nilが返ること' do
        expect(current_user).to be_nil
      end
    end
  end

  describe '#logged_in?' do
    before do
      @user = FactoryBot.create(:user)
    end

    context 'ログインしている場合' do
      it 'trueが返ること' do
        log_in(@user)
        expect(logged_in?).to eq(true)
      end
    end

    context '未ログインの場合' do
      it 'falseが返ること' do
        expect(logged_in?).to eq(false)
      end
    end
  end

  describe '#log_out' do
    before do
      user = FactoryBot.create(:user)
      log_in(user)
      log_out
    end

    it 'セッションのuser_idがnilであること' do
      expect(session[:user_id]).to be_nil
    end

    it '@current_userがnilであること' do
      expect(instance_variable_get(:@current_user)).to be_nil
    end
  end
end
