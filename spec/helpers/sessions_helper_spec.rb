require 'rails_helper'

RSpec.describe SessionsHelper, type: :helper do
  describe '#log_in' do
    let(:user) { FactoryBot.create(:user) }

    context '存在するユーザーを引数に渡した場合' do
      it 'セッションでuser_idが設定されること' do
        log_in(user)
        expect(session[:user_id]).to eq(user.id)
      end
    end

    context '存在しないユーザーを引数に渡した場合' do
      let(:non_existent_user) { FactoryBot.build(:user) }

      it 'セッションのuser_idがnilであること' do
        log_in(non_existent_user)
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

    context 'ログインユーザーを引数に渡した場合' do
      it 'trueが返ること' do
        expect(current_user?(@logged_in_user)).to eq(true)
      end
    end

    context '未ログインユーザーを引数に渡した場合' do
      it 'falseが返ること' do
        expect(current_user?(@not_logged_in_user)).to eq(false)
      end
    end
  end
end
