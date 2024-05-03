require 'rails_helper'

RSpec.describe "LinksButtonFlow", type: :system do
  before do
    @sample = FactoryBot.create(:sample)
  end

  describe 'samples/show', js: true do
    context 'Linksボタンを押下しない時' do
      it 'aria-expanded属性がfalseであること' do
        visit sample_path(@sample)
        expect(page).to have_selector('button[aria-expanded="false"]')
      end
    end
    context 'Linksボタン押下した時' do
      it 'aria-expanded属性がtrueであること' do
        visit sample_path(@sample)
        click_button('Links')
        expect(page).to have_selector('button[aria-expanded="true"]')
      end
    end
  end
end
