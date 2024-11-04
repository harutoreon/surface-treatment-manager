require 'rails_helper'

RSpec.describe "Userauthenticationflow", type: :system do
  describe 'user login' do
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

        message = '名前とパスワードの組み合わせが無効です'

        expect(page).to have_selector('div', text: message)
        visit login_path
        expect(page).to_not have_selector('div', text: message)
      end
    end
  end

  describe 'user logout' do
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

  describe 'login user select' do
    before do
      @general_user = FactoryBot.create(:general_user)
      @admin_user   = FactoryBot.create(:admin_user)
    end

    describe 'sessions#create', js: true do
      context '有効なユーザー情報がある場合' do
        it '一般ユーザーでログインできること' do
          login_as_general_user
          expect(page).to have_selector('h3', text: 'メインメニュー')
        end

        it '管理者ユーザーでログインできること' do
          login_as_admin_user
          expect(page).to have_selector('h3', text: 'メインメニュー')
        end
      end

      context '無効なユーザー情報がある場合' do
        it '一般ユーザーでログインできないこと' do
          update_user_name(@general_user, 'general')
          login_as_general_user
          expect(page).to have_selector('div', text: '名前とパスワードの組み合わせが無効です')
        end

        it '管理者ユーザーでログインできないこと' do
          update_user_name(@admin_user, 'admin')
          login_as_admin_user
          expect(page).to have_selector('div', text: '名前とパスワードの組み合わせが無効です')
        end
      end
    end
  end
end