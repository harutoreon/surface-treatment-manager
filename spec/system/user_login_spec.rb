require 'rails_helper'

RSpec.describe "UserLogin", type: :system do
  before do
    @user = FactoryBot.create(:michael)
  end

  context '有効な値の場合' do
    it 'ログインに成功すること' do
      visit login_path
      fill_in('ユーザー名', with: @user.name)
      fill_in('パスワード', with: @user.password)
      click_button('ログイン')
      expect(page).to have_selector('h3', text: 'メインメニュー')
    end
  end
  context '無効な値の場合' do
    it 'ログインに失敗すること' do
      visit login_path
      fill_in('ユーザー名', with: '')
      fill_in('パスワード', with: '')
      click_button('ログイン')
      expect(page).to have_selector('div', text: 'Invalid name/password combination')
      visit login_path
      expect(page).to_not have_selector('div', text: 'Invalid name/password combination')
    end
  end
end
