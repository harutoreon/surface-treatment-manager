require 'rails_helper'

RSpec.describe 'UserLogoutFlow', type: :system do
  before do
    admin_user = User.create(name: 'admin user', password: 'adminpassword', admin: true)
    log_in(admin_user)
  end

  describe 'sessions#destroy', js: true do
    it 'ログインページに遷移するか' do
      visit setting_path
      accept_alert('Are you sure you want to log out?') do
        click_link('Log out')
      end
      expect(page).to have_selector('h3', text: 'Log in')
    end
  end
end