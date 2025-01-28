require 'rails_helper'

RSpec.describe "Sessions", type: :request do
#   describe '#create' do
#     before do
#       FactoryBot.create(:general_user)
#     end

#     context '認証に成功する場合' do
#       before do
#         @valid_login_params = { session: { name: 'general user', password: 'generalpassword' } }
#       end

#       it 'ステータスコード302が返ること' do
#         post login_path, params: @valid_login_params
#         expect(response).to have_http_status(:found)
#       end

#       it 'メインメニュー画面にリダイレクトされること' do
#         post login_path, params: @valid_login_params
#         expect(response).to redirect_to home_url
#       end
#     end

#     context '認証に失敗する場合' do
#       before do
#         @invalid_login_params = { session: { name: 'general user', password: 'general' } }
#       end

#       it 'ステータスコード422が返ること' do
#         post login_path, params: @invalid_login_params
#         expect(response).to have_http_status(:unprocessable_entity)
#       end

#       it 'ログイン画面のままであること' do
#         post login_path, params: @invalid_login_params
#         expect(response.body).to include('<title>ログイン</title>')
#       end

#       it 'フラッシュメッセージが表示されること' do
#         post login_path, params: @invalid_login_params
#         expect(flash[:danger]).to eq('名前とパスワードの組み合わせが無効です')
#       end
#     end
#   end

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
