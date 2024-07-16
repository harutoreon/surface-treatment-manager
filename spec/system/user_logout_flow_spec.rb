require 'rails_helper'

RSpec.describe 'UserLogoutFlow', type: :system do
  before do
    admin_user = User.create(name: 'admin user', password: 'adminpassword', admin: true)
    log_in(admin_user)
  end

  describe 'sessions#destroy', js: true do
    it 'ログインページに遷移するか' do
      visit setting_path
      accept_alert('本当にログアウトしますか？') do
        click_link('ログアウト')
      end
      expect(page).to have_selector('h3', text: 'ログイン')
    end
  end
end
