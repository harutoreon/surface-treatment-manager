require 'rails_helper'

RSpec.describe "MakersManagementFlow", type: :system do
  before do
    driven_by(:rack_test)

    user = FactoryBot.create(:user)
    log_in(user)

    @category = FactoryBot.create(:category)
  end

  describe 'categories#create' do
    context '有効な値を入力した場合' do
      it '登録に成功すること' do
        visit new_category_path

        fill_in('Item', with: 'めっき')

        click_button('Create Category')

        expect(page).to have_content('Category Information')
        expect(page).to have_selector('div.alert.alert-success')
      end
    end

    context '無効な値を入力した場合' do
      it '登録に失敗すること' do
        visit new_category_path

        fill_in('Item', with: '')

        click_button('Create Category')

        expect(page).to have_content('New Registration for Category')
        expect(page).to have_content('Item can\'t be blank')
      end
    end
  end

  describe 'categories#update' do
    context '有効な値を入力した場合' do
      it '更新できること' do
        visit edit_category_path(@category)

        fill_in('Item', with: 'めっき')

        click_button('Update Category')

        expect(page).to have_content('Category Information')
        expect(page).to have_selector('div.alert.alert-success')
      end
    end

    context '無効な値を入力した場合' do
      it '更新できないこと' do
        visit edit_category_path(@category)

        fill_in('Item', with: '')

        click_button('Update Category')

        expect(page).to have_content('Edit for Category')
        expect(page).to have_content('Item can\'t be blank')
      end
    end
  end

  describe 'categories#destory' do
    it '削除できること' do
      visit category_path(@category)

      click_link('Destroy')

      expect(page).to have_content('Category List')
      expect(page).to have_selector('div.alert.alert-success')
    end
  end
end
