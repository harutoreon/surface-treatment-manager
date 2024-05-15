require 'rails_helper'

RSpec.describe "CategoriesManagementFlow", type: :system do
  before do
    @category = FactoryBot.create(:category)
  end

  describe 'categories#create' do
    context '有効な値を入力した場合' do
      it 'categories/showページが表示されること' do
        visit new_category_path
        fill_in('Item',    with: '溶射')
        fill_in('Summary', with: 'セラミックスやサーメットなどを熱源を用い溶融噴射し、基材表面に噴きつけて機能皮膜を形成する処理。')
        click_button('Create Category')
        expect(page).to have_selector('h3', text: 'Category Information')
      end
      it 'フラッシュメッセージが表示されること' do
        visit new_category_path
        fill_in('Item',    with: '溶射')
        fill_in('Summary', with: 'セラミックスやサーメットなどを熱源を用い溶融噴射し、基材表面に噴きつけて機能皮膜を形成する処理。')
        click_button('Create Category')
        expect(page).to have_selector('div', text: 'Successful registration of new category!')
      end
    end
    context '無効な値を入力した場合' do
      it 'categories/newページが表示されること' do
        visit new_category_path
        fill_in('Item',    with: '')
        fill_in('Summary', with: 'セラミックスやサーメットなどを熱源を用い溶融噴射し、基材表面に噴きつけて機能皮膜を形成する処理。')
        click_button('Create Category')
        expect(page).to have_selector('h3', text: 'New Registration for Category')
      end
      it 'バリデーションエラーが表示されること' do
        visit new_category_path
        fill_in('Item',    with: '')
        fill_in('Summary', with: 'セラミックスやサーメットなどを熱源を用い溶融噴射し、基材表面に噴きつけて機能皮膜を形成する処理。')
        click_button('Create Category')
        expect(page).to have_selector('div', text: 'Item can\'t be blank')
      end
    end
  end

  describe 'categories#update' do
    context 'ログイン済みで' do
      before do
        user = FactoryBot.create(:user)
        log_in(user)
      end

      context '有効な値を入力した場合' do
        it 'categories/showページが表示されること' do
          visit edit_category_path(@category)
          fill_in('Item', with: '溶射')
          fill_in('Summary', with: 'セラミックスやサーメットなどを熱源を用い溶融噴射し、基材表面に噴きつけて機能皮膜を形成する処理。')
          click_button('Update Category')
          expect(page).to have_selector('h3', text: 'Category Information')
        end
        it 'フラッシュメッセージが表示されること' do
          visit edit_category_path(@category)
          fill_in('Item', with: '溶射')
          fill_in('Summary', with: 'セラミックスやサーメットなどを熱源を用い溶融噴射し、基材表面に噴きつけて機能皮膜を形成する処理。')
          click_button('Update Category')
          expect(page).to have_selector('div', text: 'Successful updated category information!')
        end
      end
      context '無効な値を入力した場合' do
        it 'categories/editページが表示されること' do
          visit edit_category_path(@category)
          fill_in('Item', with: '')
          click_button('Update Category')
          expect(page).to have_selector('h3', text: 'Edit for Category')
        end
        it 'バリデーションエラーが出ること' do
          visit edit_category_path(@category)
          fill_in('Item', with: '')
          click_button('Update Category')
          expect(page).to have_selector('div', text: 'Item can\'t be blank')
        end
      end
    end
    context '未ログインの場合' do
      it 'ログインページにリダイレクトされること' do
        visit edit_category_path(@category)
        expect(page).to have_selector('h3', text: 'Log in')
      end
      it 'フラッシュメッセージが表示されること' do
        visit edit_category_path(@category)
        expect(page).to have_selector('div', text: 'Please log in.')
      end
    end
  end

  describe 'categories#destory' do
    context 'ログイン済みの場合' do
      before do
        user = FactoryBot.create(:user)
        log_in(user)
      end

      it 'categories/indexページが表示されること' do
        visit category_path(@category)
        click_link('Destroy')
        expect(page).to have_selector('h3', text: 'Category List')
      end
      it 'フラッシュメッセージが表示されること' do
        visit category_path(@category)
        click_link('Destroy')
        expect(page).to have_selector('div', text: 'Successful deleted category!')
      end
    end
    context '未ログインの場合' do
      it 'ログインページにリダイレクトされること' do
        visit category_path(@category)
        click_link('Destroy')
        expect(page).to have_selector('h3', text: 'Log in')
      end
      it 'フラッシュメッセージが表示されること' do
        visit category_path(@category)
        click_link('Destroy')
        expect(page).to have_selector('div', text: 'Please log in.')
      end
    end
  end
end
