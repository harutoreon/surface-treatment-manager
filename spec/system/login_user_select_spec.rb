require 'rails_helper'

RSpec.describe 'LoginUserSelect', type: :system do
  before do
    @general_user = User.create(name: 'general user', password: 'generalpassword', admin: false)
    @admin_user   = User.create(name: 'admin user',   password: 'adminpassword',   admin: true)
  end

  describe 'sessions#create', js: true do
    context '登録されているユーザー情報が有効な場合' do
      it 'general userの情報でログインできること' do
        visit root_path
        choose('General user')
        click_button('Log in')
        expect(page).to have_selector('h3', text: 'Main Menu')
      end
      it 'admin userの情報でログインできること' do
        visit root_path
        choose('Admin user')
        click_button('Log in')
        expect(page).to have_selector('h3', text: 'Main Menu')
      end
    end
    context '登録されているユーザー情報が無効な場合' do
      it 'general userの情報でログインできないこと' do
        @general_user.update(name: 'general')
        visit root_path
        choose('General user')
        click_button('Log in')
        expect(page).to have_selector('div.alert.alert-danger')
      end
      it 'admin userの情報でログインできないこと' do
        @admin_user.update(name: 'admin')
        visit root_path
        choose('Admin user')
        click_button('Log in')
        expect(page).to have_selector('div.alert.alert-danger')
      end
    end
  end
end
