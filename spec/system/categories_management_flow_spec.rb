require 'rails_helper'

RSpec.describe "CategoriesManagementFlow", type: :system do
  describe '#index' do
    before do
      Category.create([
        { item: 'めっき', summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。' },
        { item: '陽極酸化', summary: '人工的にアルミニウム表面に分厚い酸化アルミニウム被膜を作る処理のこと。' },
        { item: '化成', summary: '金属の表面に処理剤を作用させて化学反応を起こさせる処理のこと。' },
        { item: 'コーティング', summary: '溶射金属やセラミックスの粉末を、溶解状態にして製品表面に吹き付ける処理のこと。' },
        { item: '表面硬化', summary: '主に金属材料に対して行われる、加熱・冷却・雰囲気により材料の性質を変化させる処理のこと。' }
      ])
    end

    it '各カテゴリー情報へのリンクが表示されること' do
      visit categories_path
      expect(page).to have_link(href: category_path(Category.find_by(item: 'めっき')))
      expect(page).to have_link(href: category_path(Category.find_by(item: '陽極酸化')))
      expect(page).to have_link(href: category_path(Category.find_by(item: '化成')))
      expect(page).to have_link(href: category_path(Category.find_by(item: 'コーティング')))
      expect(page).to have_link(href: category_path(Category.find_by(item: '表面硬化')))
    end
  end

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

  describe '#new' do
    it 'カテゴリー名と概要のテキストフィールドが存在すること' do
      visit new_category_path
      expect(page).to have_selector('input', id: 'category_item')
      expect(page).to have_selector('input', id: 'category_summary')
    end

    it '登録ボタンが存在すること' do
      visit new_category_path
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
        expect(page).to have_selector('div', text: '（カテゴリー名）が空白です。')
      end
    end
  end

  describe '#edit' do
    before do
      user = FactoryBot.create(:user)
      log_in(user)

      @category = FactoryBot.create(:category)
    end

    it 'カテゴリー名と概要のテキストフィールドが存在すること' do
      visit edit_category_path(@category)
      expect(page).to have_selector('input[type="text"][value="めっき"]')
      expect(page).to have_selector('input[type="text"][value="金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。"]')
    end

    it '更新ボタンが存在すること' do
      visit edit_category_path(@category)
      expect(page).to have_selector('input[type="submit"][value="更新"]')
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
          expect(page).to have_selector('div', text: '（カテゴリー名）が空白です。')
        end
      end
    end

    context '未ログインの場合' do
      it 'ログインページにリダイレクトされること' do
        visit edit_category_path(@category)
        expect(page).to have_selector('h3',  text: 'ログイン')
        expect(page).to have_selector('div', text: 'ログインしてください')
      end
    end
  end

  describe '#destroy' do
    before do
      @admin_user = FactoryBot.create(:admin_user)
      log_in(@admin_user)
      @category = FactoryBot.create(:category)
    end

    it '削除に成功すること' do
      visit category_path(@category)
      click_link('削除')
      expect(page).to have_selector('h3',  text: 'カテゴリーリスト')
      expect(page).to have_selector('div', text: 'カテゴリーの削除に成功しました!')
    end
  end
end
