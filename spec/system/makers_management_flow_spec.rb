require 'rails_helper'

RSpec.describe "MakersManagementFlow", type: :system do
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

  describe '#create' do
    before do
      general_user = FactoryBot.create(:general_user)
      log_in(general_user)
    end

    context '有効な値の場合' do
      it '登録に成功すること' do
        visit new_maker_path
        fill_in('Name',             with: '松本情報合名会社')
        fill_in('Postal code',      with: '859-1105')
        fill_in('Address',          with: '東京都渋谷区神南1-2-3')
        fill_in('Phone number',     with: '075-4747-2450')
        fill_in('Fax number',       with: '075-4747-2451')
        fill_in('Email',            with: 'sample_maker@example.com')
        fill_in('Home page',        with: 'https://example.com/')
        fill_in('Manufacturer rep', with: '池田 彩花')
        click_button('Create Maker')
        expect(page).to have_selector('h3',  text: 'メーカー情報')
        expect(page).to have_selector('div', text: 'Successful registration of new maker!')
      end
    end
    context '無効な値の場合' do
      it '登録に失敗すること' do
        visit new_maker_path
        fill_in('Name',             with: '')
        fill_in('Postal code',      with: '859-1105')
        fill_in('Address',          with: '東京都渋谷区神南1-2-3')
        fill_in('Phone number',     with: '075-4747-2450')
        fill_in('Fax number',       with: '075-4747-2451')
        fill_in('Email',            with: 'sample_maker@example.com')
        fill_in('Home page',        with: 'https://example.com/')
        fill_in('Manufacturer rep', with: '池田 彩花')
        click_button('Create Maker')
        expect(page).to have_selector('h3',  text: 'New Registration for Maker')
        expect(page).to have_selector('div', text: 'Name can\'t be blank')
      end
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
          fill_in('Name', with: '岡田通信合資会社')
          click_button('Update Maker')
          expect(page).to have_selector('h3',  text: 'メーカー情報')
          expect(page).to have_selector('div', text: 'Successful updated maker information!')
        end
      end
      context '無効な値を入力した場合' do
        it '更新に失敗すること' do
          visit edit_maker_path(@maker)
          fill_in('Name', with: '')
          click_button('Update Maker')
          expect(page).to have_selector('h3',  text: 'Edit for Maker')
          expect(page).to have_selector('div', text: 'Name can\'t be blank')
        end
      end
    end
    context '未ログインの場合' do
      it 'ログインページにリダイレクトされること' do
        visit edit_maker_path(@maker)
        expect(page).to have_selector('h3',  text: 'Log in')
        expect(page).to have_selector('div', text: 'Please log in.')
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
      expect(page).to have_selector('div', text: 'Successful deleted maker!')
    end
  end
end
