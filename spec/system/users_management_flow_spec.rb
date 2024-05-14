require 'rails_helper'

RSpec.describe "UsersManagementFlow", type: :system do
  before do
    @user = FactoryBot.create(:user)
  end

  describe 'users#create' do
    context '有効な値の場合' do
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
    context '無効な値の場合' do
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
    before do
      @other = FactoryBot.create(:michael)
    end

    context 'ログイン済みで' do
      before do
        log_in(@user)
      end

      context '有効な値の場合' do
        it 'users/showページが表示されること' do
          visit edit_user_path(@other)
          fill_in('Name', with: 'example user')
          click_button('Update User')
          expect(page).to have_content('User Information')
        end
        it 'フラッシュメッセージが表示されること' do
          visit edit_user_path(@other)
          fill_in('Name', with: 'example user')
          click_button('Update User')
          expect(page).to have_selector('div', text: 'Successful updated user information!')
        end
      end
      context '無効な値の場合' do
        it '更新できないこと' do
          visit edit_user_path(@other)
          fill_in('Name', with: '')
          click_button('Update User')
          expect(page).to have_content('Name can\'t be blank')
        end
      end
    end
    context '未ログインの場合' do
      it 'ログインページにリダイレクトされること' do
        visit edit_user_path(@other)
        expect(page).to have_selector('h3', text: 'Log in')
      end
      it 'フラッシュメッセージが表示されること' do
        visit edit_user_path(@other)
        expect(page).to have_selector('div', text: 'Please log in.')
      end
    end
  end

  describe 'users#destroy' do
    before do
      @other = FactoryBot.create(:michael)
    end

    context 'ログイン済みの場合' do
      before do
        log_in(@user)
      end

      it 'users/indexページが表示されること' do
        visit user_path(@other)
        click_link('Destroy')
        expect(page).to have_selector('h3', text: 'User List')
      end
      it 'フラッシュメッセージが表示されること' do
        visit user_path(@other)
        click_link('Destroy')
        expect(page).to have_selector('div', text: 'Successful deleted user!')
      end
    end
    context '未ログインの場合' do
      it 'ログインページにリダイレクトされること' do
        visit user_path(@other)
        click_link('Destroy')
        expect(page).to have_selector('h3', text: 'Log in')
      end
      it 'フラッシュメッセージが表示されること' do
        visit user_path(@other)
        click_link('Destroy')
        expect(page).to have_selector('div', text: 'Please log in.')
      end
    end
  end
end
