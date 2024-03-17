require 'rails_helper'

RSpec.describe "UserLogin", type: :system do
  before do
    driven_by(:rack_test)
  end

  context '有効な値を入力した場合' do
    let(:user) { FactoryBot.create(:michael) }

    it 'static_pages#homeページにリダイレクトすること（ログイン成功）' do
      visit login_path

      fill_in('Name',     with: user.name)
      fill_in('Password', with: user.password)

      click_button('Log in')

      expect(page).to have_content('Main Menu')
      expect(page).to have_link(id: 'name_search', href: category_name_path)
      expect(page).to have_link(id: 'category_search', href: category_category_path)
      expect(page).to have_link(id: 'maker_search', href: category_maker_path)
    end
  end

  context '無効な値を入力した場合' do
    it 'sessions#newページを再描画すること（ログイン失敗）' do
      visit login_path

      fill_in('Name',     with: '')
      fill_in('Password', with: '')

      click_button('Log in')
      expect(page).to have_selector('div.alert.alert-danger')

      visit login_path
      expect(page).to_not have_selector('div.alert.alert-danger')
    end
  end
end
