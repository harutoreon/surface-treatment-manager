require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  describe '#create' do
    before do
      @general_user = FactoryBot.create(:general_user)
    end

    context '認証に成功した場合' do
      before do
        @valid_login_params = { name: 'general user', password: 'generalpassword' }
      end

      it 'ステータスコードのレスポンスがokであること' do
        post "/login", params: @valid_login_params
        expect(response).to have_http_status(:ok)
      end

      # it 'セッションにgeneral userのidが登録されること' do
      #   post "/login", params: @valid_login_params
      #   expect(session[:user_id]).to eq(@general_user.id)
      # end

      # it 'ユーザー情報が返ること' do
      #   post "/login", params: @valid_login_params
      #   json = JSON.parse(response.body, symbolize_names: true)
      #   expect(json[:user][:name]).to eq('general user')
      # end
    end

    context '認証に失敗した場合' do
      before do
        @invalid_login_params = { session: { name: 'general user', password: '' } }
      end

      it 'レスポンスのステータスがunprocessable_entityであること' do
        post "/login", params: @invalid_login_params
        expect(response).to have_http_status(:unauthorized)
      end

      it 'エラーメッセージが返ること' do
        post "/login", params: @invalid_login_params
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:error]).to eq('invalid credentials')
      end
    end
  end

  describe '#destroy' do
    before do
      user = FactoryBot.create(:general_user)
      post "/login", params: { name: user.name, password: user.password }
    end

    it 'レスポンスのステータスコードがokであること' do
      delete "/logout"
      expect(response).to have_http_status(:ok)
    end

    it 'ログイン状態がfalseであること' do
      delete "/logout"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json[:logged_in]).to eq(false)
    end

    it 'セッションのユーザーidが空であること' do
      delete "/logout"
      expect(session[:user_id]).to eq(nil)
    end
  end

  # describe '#logged_in?' do
  #   context 'ログインしている場合' do
  #     before do
  #       @user = FactoryBot.create(:general_user)
  #       post "/login", params: { name: @user.name, password: @user.password }
  #     end
  #
  #     it 'レスポンスのステータスコードがokであること' do
  #       get "/logged_in"
  #       expect(response).to have_http_status(:ok)
  #     end
  #   end
  #
  #   context 'ログインしていない場合' do
  #     it 'レスポンスのステータスがunauthorizedであること' do
  #       get "/logged_in"
  #       expect(response).to have_http_status(:unauthorized)
  #     end
  #   end
  # end
end
