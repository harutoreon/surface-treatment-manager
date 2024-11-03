require 'rails_helper'

RSpec.describe "UsersManagementFlow", type: :system do
  describe '#index' do
    before do
      admin_user = FactoryBot.create(:admin_user)
      FactoryBot.create(:general_user)
      log_in(admin_user)

      FactoryBot.create_list(:user_list, 10)
    end

    it 'ユーザー10件表示されること' do
      visit users_path
      expect(page).to have_link(href: %r{/users/\d}, count: 10)
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

  describe '#new' do
    it 'テキストフィールドが表示されること' do
      visit new_user_path
      expect(page).to have_selector('input', id: 'user_name')
    end

    it 'セレクトフィールドが表示されること' do
      visit new_user_path
      expect(page).to have_selector('select', id: 'user_department')
    end

    it 'パスワードとパスワード確認のフィールドが表示されること' do
      visit new_user_path
      expect(page).to have_selector('input', id: 'user_password')
      expect(page).to have_selector('input', id: 'user_password_confirmation')
    end

    it '登録ボタンが表示されること' do
      visit new_user_path
      expect(page).to have_selector('input[type="submit"][value="登録"]')
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
        expect(page).to have_selector('div', text: 'ユーザーの登録に成功しました!')
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
        expect(page).to have_selector('div', text: '（ユーザー名）が空白です。')
      end
    end
  end

  describe '#edit' do
    before do
      general_user = FactoryBot.create(:general_user)
      log_in(general_user)

      @sample_user = FactoryBot.create(:sample_user)
    end

    it 'テキストフィールドが存在すること' do
      visit edit_user_path(@sample_user)
      expect(page).to have_selector('input[type="text"][value="sample user"]')
    end

    it 'セレクトフィールドが存在すること' do
      visit edit_user_path(@sample_user)
      expect(page).to have_selector('select[id="user_department"] option[selected]', text: '品質管理部')
    end

    it 'パスワードとパスワード確認のフィールドが存在すること' do
      visit edit_user_path(@sample_user)
      expect(page).to have_selector('input', id: 'user_password')
      expect(page).to have_selector('input', id: 'user_password_confirmation')
    end

    it '更新ボタンが存在すること' do
      visit edit_user_path(@sample_user)
      expect(page).to have_selector('input[type="submit"][value="更新"]')
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
          fill_in('パスワード', with: 'password')
          fill_in('パスワードの確認', with: 'password')
          click_button('更新')
          expect(page).to have_selector('h3',  text: 'ユーザー情報')
          expect(page).to have_selector('div', text: 'ユーザーの更新に成功しました!')
        end
      end

      context '無効な値の場合' do
        it '更新に失敗すること' do
          visit edit_user_path(@sample_user)
          fill_in('ユーザー名', with: '')
          fill_in('パスワード', with: 'password')
          fill_in('パスワードの確認', with: 'password')
          click_button('更新')
          expect(page).to have_selector('div', text: '（ユーザー名）が空白です。')
        end
      end
    end

    context '未ログインの場合' do
      it 'ログインページにリダイレクトされること' do
        visit edit_user_path(@sample_user)
        expect(page).to have_selector('h3',  text: 'ログイン')
        expect(page).to have_selector('div', text: 'ログインしてください')
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
      expect(page).to have_selector('div', text: 'ユーザーの削除に成功しました!')
    end
  end
end
