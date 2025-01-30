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

      it 'ステータスコードのレスポンスがsuccessであること' do
        post "/login", params: @valid_login_params
        expect(response).to have_http_status(:success)
      end

      it 'セッションにgeneral userのidが登録されること' do
        post "/login", params: @valid_login_params
        expect(session[:user_id]).to eq(@general_user.id)
      end

      it 'ユーザー情報が返ること' do
        post "/login", params: @valid_login_params
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:user][:name]).to eq('general user')
      end
    end

    context '認証に失敗した場合' do
      before do
        @invalid_login_params = { session: { name: 'general user', password: '' } }
      end

      it 'レスポンスのステータスがunprocessable_entityであること' do
        post "/login", params: @invalid_login_params
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'エラーメッセージが返ること' do
        post "/login", params: @invalid_login_params
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:error]).to eq('Invalid name or password')
      end
    end
  end

#   describe '#destroy' do
#     before do
#       user = FactoryBot.create(:user)
#       log_in(user)
#     end

#     it 'ステータスコード303が返ること' do
#       delete logout_path
#       expect(response).to have_http_status(:see_other)
#     end

#     it 'ログイン画面にリダイレクトされること' do
#       delete logout_path
#       expect(response).to redirect_to login_url
#     end

#     it '@current_userが空であること' do
#       delete logout_path
#       expect(logged_in?).to_not be_truthy
#     end
#   end
end
