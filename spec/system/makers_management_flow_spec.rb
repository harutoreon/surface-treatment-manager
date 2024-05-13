require 'rails_helper'

RSpec.describe "MakersManagementFlow", type: :system do
  before do
    @maker = FactoryBot.create(:maker)
  end

  describe 'makers#create' do
    context '有効な値を入力した場合' do
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

        expect(page).to have_content('Maker Information')
        expect(page).to have_selector('div.alert.alert-success')
      end
    end

    context '無効な値を入力した場合' do
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

        expect(page).to have_content('New Registration for Maker')
        expect(page).to have_content('Name can\'t be blank')
      end
    end
  end

  describe 'makers#update' do
    context '有効な値を入力した場合' do
      it '更新できること' do
        visit edit_maker_path(@maker)

        fill_in('Name', with: '岡田通信合資会社')

        click_button('Update Maker')

        expect(page).to have_content('Maker Information')
        expect(page).to have_selector('div.alert.alert-success')
      end
    end

    context '無効な値を入力した場合' do
      it '更新できないこと' do
        visit edit_maker_path(@maker)

        fill_in('Name', with: '')

        click_button('Update Maker')

        expect(page).to have_content('Edit for Maker')
        expect(page).to have_content('Name can\'t be blank')
      end
    end
  end

  describe 'makers#destroy' do
    it '削除できること' do
      visit maker_path(@maker)

      click_link('Destroy')

      expect(page).to have_content('Maker List')
      expect(page).to have_selector('div.alert.alert-success')
    end
  end
end
