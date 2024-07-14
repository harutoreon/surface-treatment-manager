require 'rails_helper'

RSpec.describe "CategoriesManagementFlow", type: :system do
  describe '#show' do
    before do
      @category = FactoryBot.create(:category)
    end

    context '管理者ユーザーでログインした場合' do
      before do
        admin_user = FactoryBot.create(:admin_user)
        log_in(admin_user)
      end

      it '削除用リンクが表示されること' do
        visit category_path(@category)
        expect(page).to have_link('削除', count: 1)
      end
    end
    context '一般ユーザーでログインした場合' do
      before do
        general_user = FactoryBot.create(:general_user)
        log_in(general_user)
      end

      it '削除用リンクが表示されないこと' do
        visit category_path(@category)
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
        visit new_category_path
        fill_in('カテゴリー名', with: '溶射')
        fill_in('概要', with: 'セラミックスなどを基材表面に噴きつけて機能皮膜を形成する処理。')
        click_button('登録')
        expect(page).to have_selector('h3',  text: 'カテゴリー情報')
        expect(page).to have_selector('div', text: 'カテゴリーの登録に成功しました!')
      end
    end
    context '無効な値の場合' do
      it '登録に失敗すること' do
        visit new_category_path
        fill_in('カテゴリー名', with: '')
        fill_in('概要', with: 'セラミックスなどを基材表面に噴きつけて機能皮膜を形成する処理。')
        click_button('登録')
        expect(page).to have_selector('h3',  text: 'カテゴリー情報の登録')
        expect(page).to have_selector('div', text: 'Item can\'t be blank')
      end
    end
  end

  describe '#update' do
    before do
      @category = FactoryBot.create(:category)
    end

    context 'ログイン済みで' do
      before do
        user = FactoryBot.create(:user)
        log_in(user)
      end

      context '有効な値の場合' do
        it '更新に成功すること' do
          visit edit_category_path(@category)
          fill_in('カテゴリー名', with: '塗装')
          fill_in('概要', with: '塗料によって固体表面に塗膜を形成させる加工方法のこと。')
          click_button('更新')
          expect(page).to have_selector('h3',  text: 'カテゴリー情報')
          expect(page).to have_selector('div', text: 'カテゴリーの更新に成功しました!')
        end
      end
      context '無効な値の場合' do
        it '更新に失敗すること' do
          visit edit_category_path(@category)
          fill_in('カテゴリー名', with: '')
          fill_in('概要', with: '塗料によって固体表面に塗膜を形成させる加工方法のこと。')
          click_button('更新')
          expect(page).to have_selector('h3',  text: 'カテゴリー情報の編集')
          expect(page).to have_selector('div', text: 'Item can\'t be blank')
        end
      end
    end
    context '未ログインの場合' do
      it 'ログインページにリダイレクトされること' do
        visit edit_category_path(@category)
        expect(page).to have_selector('h3',  text: 'ログイン')
        expect(page).to have_selector('div', text: 'Please log in.')
      end
    end
  end

  describe '#destory' do
    before do
      @category = FactoryBot.create(:category)
      admin_user = FactoryBot.create(:admin_user)
      log_in(admin_user)
    end

    it '削除に成功すること' do
      visit category_path(@category)
      click_link('削除')
      expect(page).to have_selector('h3',  text: 'カテゴリーリスト')
      expect(page).to have_selector('div', text: 'カテゴリーの削除に成功しました!')
    end
  end
end
