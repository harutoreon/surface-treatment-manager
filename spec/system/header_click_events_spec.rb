require 'rails_helper'

RSpec.describe 'HeaderClickEvents', type: :system do
  context 'ユーザーがログインしている場合' do
    before do
      user = FactoryBot.create(:user)
      log_in(user)
    end

    it 'は、メインメニューに遷移すること' do
      visit root_path
      click_link('Surface Treatment Manager')
      expect(page).to have_selector('h3', text: 'Main Menu')
    end
  end
  context 'ユーザーがログインしていない場合' do
    it 'は、ログインを要求すること' do
      visit root_path
      click_link('Surface Treatment Manager')
      expect(page).to have_selector('h3', text: 'Log in')
      expect(page).to have_selector('div', text: 'Please log in.')
    end
  end
end