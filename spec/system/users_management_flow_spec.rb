require 'rails_helper'

RSpec.describe "UsersManagementFlow", type: :system do
  before do
    user = FactoryBot.create(:user)
    log_in(user)

    @user = FactoryBot.create(:user)
  end

  describe 'users#create' do
    context '有効な値を入力した場合' do
      it '登録に成功すること' do
        visit new_user_path

        fill_in('Name',         with: 'sample user')
        fill_in('Password',     with: 'password')
        fill_in('Confirmation', with: 'password')

        click_button('Create User')

        expect(page).to have_content('User Information')
        expect(page).to have_selector('div.alert.alert-success')
      end
    end
    context '無効な値を入力した場合' do
      it '登録に失敗すること' do
        visit new_user_path

        fill_in('Name',         with: '')
        fill_in('Password',     with: 'password')
        fill_in('Confirmation', with: 'password')

        click_button('Create User')

        expect(page).to have_content('New Registration for User')
        expect(page).to have_content('Name can\'t be blank')
      end
    end
  end

  describe 'users#update' do
    context '有効な値を入力した場合' do
      it '更新できること' do
        visit edit_user_path(@user)

        fill_in('Name', with: 'example user')

        click_button('Update User')

        expect(page).to have_content('User Information')
        expect(page).to have_selector('div.alert.alert-success')
      end
    end
    context '無効な値を入力した場合' do
      it '更新できないこと' do
        visit edit_user_path(@user)

        fill_in('Name', with: '')

        click_button('Update User')

        expect(page).to have_content('Edit for User')
        expect(page).to have_content('Name can\'t be blank')
      end
    end
  end

  describe 'users#destroy' do
    it '削除できること' do
      visit user_path(@user)

      click_link('Destroy')

      expect(page).to have_content('User List')
      expect(page).to have_selector('div.alert.alert-success')
    end
  end
end
