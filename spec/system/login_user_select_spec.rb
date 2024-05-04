require 'rails_helper'

RSpec.describe 'LoginUserSelect', type: :system do
  before do
    @general_user = User.create(name: 'general user', password: 'generalpassword', admin: false)
    @admin_user   = User.create(name: 'admin user',   password: 'adminpassword',   admin: true)
  end

  describe 'sessions#create', js: true do
    context 'General userでログインした場合' do
      it 'メインメニューにリダイレクトすること' do
        visit root_path
        choose('General user')
        click_button('Log in')
        expect(page).to have_selector('h3', text: 'Main Menu')
      end
    end
    context 'Admin userでログインした場合' do
      it 'メインメニューにリダイレクトすること' do
        visit root_path
        choose('Admin user')
        click_button('Log in')
        expect(page).to have_selector('h3', text: 'Main Menu')
      end
    end
  end
end
