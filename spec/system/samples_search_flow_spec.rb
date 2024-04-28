require 'rails_helper'

RSpec.describe "SamplesSearchFlow", type: :system do
  before do
    user = FactoryBot.create(:user)
    log_in(user)

    10.times do
      FactoryBot.create(:anodised_aluminium)
    end
  end

  describe 'name_search_flow' do
    context '有効なデータを入力したとき' do
      it '「白アルマイト」が10件表示されること' do
        visit home_path
        expect(page).to have_content('Main Menu')

        click_link(id: 'name_search')
        expect(page).to have_content('Search by treatment')

        fill_in('keyword', with: 'アルマイト')

        click_button('Search')
        expect(page).to have_content('Search result of surface treatment')
        expect(page).to have_link('白アルマイト', count: 8)
      end
    end

    context '無効なデータを入力したとき' do
      it '「No matching sample.」が表示されること' do
        visit home_path
        expect(page).to have_content('Main Menu')

        click_link(id: 'name_search')
        expect(page).to have_content('Search by treatment')

        fill_in('keyword', with: 'めっき')

        click_button('Search')
        expect(page).to have_content('Search result of surface treatment')
        expect(page).to have_content('No matching surface treatment.')
      end
    end
  end

  describe 'category_search_flow' do
    context '有効なデータを入力したとき' do
      it '「白アルマイト」が10件表示されること' do
        visit home_path
        expect(page).to have_content('Main Menu')

        click_link(id: 'category_search')
        expect(page).to have_content('Search by category')

        select('陽極酸化')

        click_button('Search')
        expect(page).to have_content('Search result of surface treatment')
        expect(page).to have_link('白アルマイト', count: 8)
      end
    end

    context '無効なデータを入力したとき' do
      it '「No matching sample.」が表示されること' do
        visit home_path
        expect(page).to have_content('Main Menu')

        click_link(id: 'category_search')
        expect(page).to have_content('Search by category')

        select('表面硬化')

        click_button('Search')
        expect(page).to have_content('Search result of surface treatment')
        expect(page).to have_content('No matching surface treatment.')
      end
    end
  end

  describe 'maker_search_flow' do
    context '有効なデータを入力したとき' do
      it '「白アルマイト」が10件表示されること' do
        visit home_path
        expect(page).to have_content('Main Menu')

        click_link(id: 'maker_search')
        expect(page).to have_content('Search by maker')

        fill_in('keyword', with: '有限会社')

        click_button('Search')
        expect(page).to have_content('Search result of surface treatment')
        expect(page).to have_link('白アルマイト', count: 8)
      end
    end

    context '無効なデータを入力したとき' do
      it '「No matching sample.」が表示されること' do
        visit home_path
        expect(page).to have_content('Main Menu')

        click_link(id: 'maker_search')
        expect(page).to have_content('Search by maker')

        fill_in('keyword', with: '株式会社')

        click_button('Search')
        expect(page).to have_content('Search result of surface treatment')
        expect(page).to have_content('No matching surface treatment.')
      end
    end
  end
end
