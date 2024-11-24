require 'rails_helper'

RSpec.describe "MakersManagementFlow", type: :system do
  describe '#index' do
    before do
      FactoryBot.create_list(:maker_list, 9)
    end

    it '/makers/を含むリンクが8件表示されること' do
      visit makers_path
      expect(page).to have_link(href: %r{/makers/\d}, count: 8)
    end
  end

  describe '#show' do
    before do
      @maker = FactoryBot.create(:maker)
    end

    context '管理者ユーザーでログインした場合' do
      before do
        admin_user = FactoryBot.create(:admin_user)
        log_in(admin_user)
      end

      it '削除用リンクが表示されること' do
        visit maker_path(@maker)
        expect(page).to have_link('削除', count: 1)
      end
    end

    context '一般ユーザーでログインした場合' do
      before do
        general_user = FactoryBot.create(:general_user)
        log_in(general_user)
      end

      it '削除用リンクが表示されないこと' do
        visit maker_path(@maker)
        expect(page).to have_link('Destroy', count: 0)
      end
    end
  end

  describe '#new' do
    it 'テキストフィールドが存在すること' do
      visit new_maker_path
      expect(page).to have_selector('input', id: 'maker_name')
      expect(page).to have_selector('input', id: 'maker_postal_code')
      expect(page).to have_selector('input', id: 'maker_address')
      expect(page).to have_selector('input', id: 'maker_phone_number')
      expect(page).to have_selector('input', id: 'maker_fax_number')
      expect(page).to have_selector('input', id: 'maker_email')
      expect(page).to have_selector('input', id: 'maker_home_page')
      expect(page).to have_selector('input', id: 'maker_manufacturer_rep')
    end

    it '登録ボタンが存在すること' do
      visit new_maker_path
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
        visit new_maker_path
        fill_in('メーカー名', with: '松本情報合名会社')
        fill_in('郵便番号', with: '859-1105')
        fill_in('住所', with: '東京都渋谷区神南1-2-3')
        fill_in('電話番号', with: '075-4747-2450')
        fill_in('FAX番号', with: '075-4747-2451')
        fill_in('Email', with: 'sample_maker@example.com')
        fill_in('ホームページ', with: 'https://example.com/')
        fill_in('担当者', with: '池田 彩花')
        click_button('登録')
        expect(page).to have_selector('h3',  text: 'メーカー情報')
        expect(page).to have_selector('div', text: 'メーカーの登録に成功しました!')
      end
    end

    context '無効な値の場合' do
      it '登録に失敗すること' do
        visit new_maker_path
        fill_in('メーカー名', with: '')
        fill_in('郵便番号', with: '859-1105')
        fill_in('住所', with: '東京都渋谷区神南1-2-3')
        fill_in('電話番号', with: '075-4747-2450')
        fill_in('FAX番号', with: '075-4747-2451')
        fill_in('Email', with: 'sample_maker@example.com')
        fill_in('ホームページ', with: 'https://example.com/')
        fill_in('担当者', with: '池田 彩花')
        click_button('登録')
        expect(page).to have_selector('h3',  text: 'メーカー情報の登録')
        expect(page).to have_selector('div', text: '（メーカー名）が空白です')
      end
    end
  end

  describe '#edit' do
    before do
      user = FactoryBot.create(:user)
      log_in(user)

      @maker = FactoryBot.create(:maker)
    end

    it 'テキストフィールドが存在すること' do
      visit edit_maker_path(@maker)
      expect(page).to have_selector('input[type="text"][value="松本情報合名会社"]')
      expect(page).to have_selector('input[type="text"][value="859-1105"]')
      expect(page).to have_selector('input[type="text"][value="東京都渋谷区神南1-2-3"]')
      expect(page).to have_selector('input[type="tel"][value="075-4747-2450"]')
      expect(page).to have_selector('input[type="tel"][value="075-4747-2451"]')
      expect(page).to have_selector('input[type="email"][value="sample_maker@example.com"]')
      expect(page).to have_selector('input[type="url"][value="https://example.com/"]')
      expect(page).to have_selector('input[type="text"][value="池田 彩花"]')
    end

    it '更新ボタンが存在すること' do
      visit edit_maker_path(@maker)
      expect(page).to have_selector('input[type="submit"][value="更新"]')
    end
  end

  describe '#update' do
    before do
      @maker = FactoryBot.create(:maker)
    end

    context 'ログイン済みで' do
      before do
        general_user = FactoryBot.create(:general_user)
        log_in(general_user)
      end

      context '有効な値を入力した場合' do
        it '更新に成功すること' do
          visit edit_maker_path(@maker)
          fill_in('メーカー名', with: '岡田通信合資会社')
          click_button('更新')
          expect(page).to have_selector('h3',  text: 'メーカー情報')
          expect(page).to have_selector('div', text: 'メーカーの更新に成功しました!')
        end
      end

      context '無効な値を入力した場合' do
        it '更新に失敗すること' do
          visit edit_maker_path(@maker)
          fill_in('メーカー名', with: '')
          click_button('更新')
          expect(page).to have_selector('h3',  text: 'メーカー情報の編集')
          expect(page).to have_selector('div', text: '（メーカー名）が空白です')
        end
      end
    end

    context '未ログインの場合' do
      it 'ログインページにリダイレクトされること' do
        visit edit_maker_path(@maker)
        expect(page).to have_selector('h3',  text: 'ログイン')
        expect(page).to have_selector('div', text: 'ログインしてください')
      end
    end
  end

  describe '#destroy' do
    before do
      @maker = FactoryBot.create(:maker)
      admin_user = FactoryBot.create(:admin_user)
      log_in(admin_user)
    end

    it '削除に成功すること' do
      visit maker_path(@maker)
      click_link('削除')
      expect(page).to have_selector('h3',  text: 'メーカーリスト')
      expect(page).to have_selector('div', text: 'メーカーの削除に成功しました!')
    end
  end
end
