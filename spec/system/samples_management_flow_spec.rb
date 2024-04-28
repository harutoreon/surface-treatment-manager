require 'rails_helper'

RSpec.describe "SamplesManagementFlow", type: :system do
  before do
    user = FactoryBot.create(:user)
    log_in(user)

    FactoryBot.create(:category, item: 'めっき')
    @sample = FactoryBot.create(:sample)
  end

  describe 'samples#create' do
    context '有効な値を入力した場合' do
      it '登録が成功すること' do
        visit new_sample_path

        fill_in('Name', with: '無電解ニッケルめっき')
        select("めっき", from: 'sample_category')
        fill_in('Color', with: 'ゴールド')
        fill_in('Maker', with: '株式会社中川鉱業')
        fill_in('Hardness', with: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
        fill_in('Film thickness', with: '通常は3～5μm、厚めの場合は20～50μmまで可能')
        fill_in('Feature', with: '耐食性・耐摩耗性・耐薬品性・耐熱性')
        attach_file('Picture', 'spec/fixtures/test.jpg')

        click_button('Create Sample')

        expect(page).to have_selector('div.alert.alert-success')
        expect(page).to have_content('Surface Treatment Information')
      end
    end

    context '無効な値を入力した場合' do
      it '登録が失敗すること' do
        visit new_sample_path

        fill_in('Name', with: '')
        select("めっき", from: 'sample_category')
        fill_in('Color', with: 'ゴールド')
        fill_in('Maker', with: '株式会社中川鉱業')
        fill_in('Hardness', with: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
        fill_in('Film thickness', with: '通常は3～5μm、厚めの場合は20～50μmまで可能')
        fill_in('Feature', with: '耐食性・耐摩耗性・耐薬品性・耐熱性')
        attach_file('Picture', 'spec/fixtures/test.jpg')

        click_button('Create Sample')

        expect(page).to have_content('Name can\'t be blank')
        expect(page).to have_content('New Registration for Surface Treatment')
      end
    end
  end

  describe 'samples#update' do
    context '有効な値を入力した場合' do
      it '更新できること' do
        visit edit_sample_path(@sample)

        fill_in('Name', with: '亜鉛めっき')

        click_button('Update Sample')

        expect(page).to have_selector('div.alert.alert-success')
        expect(page).to have_content('Surface Treatment Information')
      end
    end

    context '無効な値を入力した場合' do
      it '更新できないこと' do
        visit edit_sample_path(@sample)

        fill_in('Name', with: '')

        click_button('Update Sample')

        expect(page).to have_content('Name can\'t be blank')
        expect(page).to have_content('Edit for Surface Treatment')
      end
    end
  end

  describe 'samples#destroy' do
    it '削除できること' do
      visit sample_path(@sample)

      click_link('Destroy')

      expect(page).to have_selector('div.alert.alert-success')
      expect(page).to have_content('Surface Treatment List')
    end
  end
end
