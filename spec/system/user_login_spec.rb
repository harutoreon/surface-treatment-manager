require 'rails_helper'

RSpec.describe "UserLogin", type: :system do
  before do
    driven_by(:rack_test)
  end

  context '有効な値の場合' do
    let(:user) { FactoryBot.create(:michael) }

    it 'ログインできること' do
      visit login_path

      fill_in 'Name',     with: user.name
      fill_in 'Password', with: user.password
      click_button 'Log in'

      expect(page).to have_selector "a[href=\"#{samples_path}\"]"
      expect(page).to have_selector "a[href=\"#{new_sample_path}\"]"
    end
  end

  context '無効な値の場合' do
    it 'ログインできないこと' do
      visit login_path

      fill_in 'Name',     with: ''
      fill_in 'Password', with: ''
      click_button 'Log in'

      expect(page).to have_selector 'div.alert.alert-danger'

      visit login_path
      expect(page).to_not have_selector 'div.alert.alert-danger'
    end
  end
end
