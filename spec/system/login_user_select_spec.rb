require 'rails_helper'

RSpec.describe 'LoginUserSelect', type: :system do
  before do
    @general_user = User.create(name: 'general user', password: 'generalpassword', admin: false)
    @admin_user   = User.create(name: 'admin user',   password: 'adminpassword',   admin: true)
  end

  describe 'sessions#create', js: true do
    context '有効なユーザー情報がある場合' do
      it '一般ユーザーでログインできること' do
        login_as_general_user
        expect(page).to have_selector('h3', text: 'Main Menu')
      end
      it '管理者ユーザーでログインできること' do
        login_as_admin_user
        expect(page).to have_selector('h3', text: 'Main Menu')
      end
    end
    context '無効なユーザー情報がある場合' do
      it '一般ユーザーでログインできないこと' do
        update_user_name(@general_user, 'general')
        login_as_general_user
        expect(page).to have_selector('div.alert.alert-danger')
      end
      it '管理者ユーザーでログインできないこと' do
        update_user_name(@admin_user, 'admin')
        login_as_admin_user
        expect(page).to have_selector('div.alert.alert-danger')
      end
    end
  end
end