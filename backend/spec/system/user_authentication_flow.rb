# require 'rails_helper'

# RSpec.describe "Userauthenticationflow", type: :system do
#   describe 'ユーザーのログイン' do
#     before do
#       @user = FactoryBot.create(:michael)
#     end

#     context '有効な値の場合' do
#       it 'ログインに成功すること' do
#         visit login_path
#         fill_in('ユーザー名', with: @user.name)
#         fill_in('パスワード', with: @user.password)
#         click_button('ログイン')
#         expect(page).to have_selector('h3', text: 'メインメニュー')
#       end
#     end

#     context '無効な値の場合' do
#       it 'ログインに失敗すること' do
#         visit login_path
#         fill_in('ユーザー名', with: '')
#         fill_in('パスワード', with: '')
#         click_button('ログイン')

#         message = '名前とパスワードの組み合わせが無効です'

#         expect(page).to have_selector('div', text: message)
#         visit login_path
#         expect(page).to_not have_selector('div', text: message)
#       end
#     end
#   end

#   describe 'ユーザーのログアウト' do
#     before do
#       admin_user = User.create(name: 'admin user', password: 'adminpassword', admin: true)
#       log_in(admin_user)
#     end

#     describe 'sessions#destroy', js: true do
#       it 'ログインページに遷移するか' do
#         visit setting_path
#         accept_alert('本当にログアウトしますか？') do
#           click_link('ログアウト')
#         end

#         expect(page).to have_selector('h3', text: 'ログイン')
#       end
#     end
#   end

#   describe 'ログイン時のユーザー選択' do
#     before do
#       @general_user = FactoryBot.create(:general_user)
#       @admin_user   = FactoryBot.create(:admin_user)
#     end

#     context 'ユーザー情報が有効である場合', js: true do
#       it '一般ユーザーでログインできること' do
#         visit root_path
#         choose('一般ユーザー')
#         click_button('ログイン')

#         expect(page).to have_selector('h3', text: 'メインメニュー')
#       end

#       it '管理者ユーザーでログインできること' do
#         visit root_path
#         choose('管理者ユーザー')
#         click_button('ログイン')

#         expect(page).to have_selector('h3', text: 'メインメニュー')
#       end
#     end

#     context 'ユーザー情報が無効である場合', js: true do
#       it '一般ユーザーでログインできないこと' do
#         @general_user.update(name: 'general')

#         visit root_path
#         choose('一般ユーザー')
#         click_button('ログイン')

#         expect(page).to have_selector('div', text: '名前とパスワードの組み合わせが無効です')
#       end

#       it '管理者ユーザーでログインできないこと' do
#         @admin_user.update(name: 'admin')

#         visit root_path
#         choose('管理者ユーザー')
#         click_button('ログイン')

#         expect(page).to have_selector('div', text: '名前とパスワードの組み合わせが無効です')
#       end
#     end
#   end
# end