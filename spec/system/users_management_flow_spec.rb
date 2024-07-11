require 'rails_helper'

RSpec.describe "UsersManagementFlow", type: :system do
  describe '#index' do
    before do
      admin_user = FactoryBot.create(:admin_user)
      FactoryBot.create(:general_user)
      log_in(admin_user)
    end

    it '管理者ユーザーと一般ユーザーはユーザーリストに表示されないこと' do
      visit users_path
      expect(page).to_not have_selector('div', text: 'admin user')
      expect(page).to_not have_selector('div', text: 'general user')
    end
  end

  describe '#show' do
    before do
      @sample_user = FactoryBot.create(:sample_user)
    end

    context '管理者ユーザーでログインした場合' do
      before do
        admin_user = FactoryBot.create(:admin_user)
        log_in(admin_user)
      end

      it '削除用リンクが表示されること' do
        visit user_path(@sample_user)
        expect(page).to have_link('削除', count: 1)
      end
    end
    context '一般ユーザーでログインした場合' do
      before do
        general_user = FactoryBot.create(:general_user)
        log_in(general_user)
      end

      it '削除用リンクが表示されないこと' do
        visit user_path(@sample_user)
        expect(page).to have_link('Destroy', count: 0)
      end
    end
  end

  describe '#create' do
    before do
      general_user = FactoryBot.create(:general_user)
      log_in(general_user)
    end

    context '有効な値の場合' do
      it '登録に成功すること' do
        visit new_user_path
        fill_in('ユーザー名', with: 'sample user')
        select('品質管理部', from: 'user_department')
        fill_in('パスワード', with: 'password')
        fill_in('パスワードの確認', with: 'password')
        click_button('登録')
        expect(page).to have_selector('h3',  text: 'ユーザー情報')
        expect(page).to have_selector('div', text: 'Successful registration of new user!')
      end
    end
    context '無効な値の場合' do
      it '登録に失敗すること' do
        visit new_user_path
        fill_in('ユーザー名', with: '')
        fill_in('パスワード', with: 'password')
        fill_in('パスワードの確認', with: 'password')
        click_button('登録')
        expect(page).to have_selector('h3',  text: 'ユーザー情報の登録')
        expect(page).to have_selector('div', text: 'Name can\'t be blank')
      end
    end
  end

  describe '#update' do
    before do
      @sample_user = FactoryBot.create(:sample_user)
    end

    context 'ログイン済みで' do
      before do
        general_user = FactoryBot.create(:general_user)
        log_in(general_user)
      end

      context '有効な値の場合' do
        it '更新に成功すること' do
          visit edit_user_path(@sample_user)
          fill_in('ユーザー名', with: 'example user')
          click_button('更新')
          expect(page).to have_selector('h3',  text: 'ユーザー情報')
          expect(page).to have_selector('div', text: 'Successful updated user information!')
        end
      end
      context '無効な値の場合' do
        it '更新に失敗すること' do
          visit edit_user_path(@sample_user)
          fill_in('ユーザー名', with: '')
          click_button('更新')
          expect(page).to have_selector('div', text: 'Name can\'t be blank')
        end
      end
    end
    context '未ログインの場合' do
      it 'ログインページにリダイレクトされること' do
        visit edit_user_path(@sample_user)
        expect(page).to have_selector('h3',  text: 'Log in')
        expect(page).to have_selector('div', text: 'Please log in.')
      end
    end
  end

  describe '#destroy' do
    before do
      @sample_user = FactoryBot.create(:sample_user)
      admin_user = FactoryBot.create(:admin_user)
      log_in(admin_user)
    end

    it '削除に成功すること' do
      visit user_path(@sample_user)
      click_link('削除')
      expect(page).to have_selector('h3',  text: 'ユーザーリスト')
      expect(page).to have_selector('div', text: 'Successful deleted user!')
    end
  end
end
