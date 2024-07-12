require 'rails_helper'

RSpec.describe "SamplesSearchFlow", type: :system do
  before do
    FactoryBot.create_list(:anodised_aluminium, 8)  # 「8」はページネーションのリミット値
  end

  describe '#name_search' do
    context '有効な値の場合' do
      it '検索対象が見つかること' do
        visit category_name_path
        fill_in('keyword', with: 'アルマイト')
        click_button('検索')
        expect(page).to have_selector('h3', text: 'Search result of surface treatment')
        expect(page).to have_link('白アルマイト', count: 8)
      end
    end
    context '無効な値の場合' do
      it '検索対象が見つからないこと' do
        visit category_name_path
        fill_in('keyword', with: 'めっき')
        click_button('検索')
        expect(page).to have_selector('h3', text: 'Search result of surface treatment')
        expect(page).to have_selector('h4', text: 'No matching surface treatment.')
      end
    end
  end

  describe '#category_search' do
    context '有効な値の場合' do
      it '検索対象が見つかること' do
        visit category_category_path
        select('陽極酸化')
        click_button('Search')
        expect(page).to have_selector('h3', text: 'Search result of surface treatment')
        expect(page).to have_link('白アルマイト', count: 8)
      end
    end
    context '無効な値の場合' do
      it '検索対象が見つからないこと' do
        visit category_category_path
        select('表面硬化')
        click_button('Search')
        expect(page).to have_selector('h3', text: 'Search result of surface treatment')
        expect(page).to have_selector('h4', text: 'No matching surface treatment.')
      end
    end
  end

  describe '#maker_search' do
    context '有効な値の場合' do
      it '検索対象が見つかること' do
        visit category_maker_path
        fill_in('keyword', with: '有限会社')
        click_button('Search')
        expect(page).to have_selector('h3', text: 'Search result of surface treatment')
        expect(page).to have_link('白アルマイト', count: 8)
      end
    end
    context '無効な値の場合' do
      it '検索対象が見つからないこと' do
        visit category_maker_path
        fill_in('keyword', with: '株式会社')
        click_button('Search')
        expect(page).to have_selector('h3', text: 'Search result of surface treatment')
        expect(page).to have_selector('h4', text: 'No matching surface treatment.')
      end
    end
  end
end
