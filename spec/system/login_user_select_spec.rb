require 'rails_helper'

RSpec.describe 'LoginUserSelect', type: :system do
  before do
    @general_user = FactoryBot.create(:general_user)
    @admin_user   = FactoryBot.create(:admin_user)
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
        expect(page).to have_selector('div', text: 'Invalid name/password combination')
      end
      it '管理者ユーザーでログインできないこと' do
        update_user_name(@admin_user, 'admin')
        login_as_admin_user
        expect(page).to have_selector('div', text: 'Invalid name/password combination')
      end
    end
  end
end
