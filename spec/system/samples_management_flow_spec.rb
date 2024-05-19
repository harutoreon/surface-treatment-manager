require 'rails_helper'

RSpec.describe "SamplesManagementFlow", type: :system do
  describe '#show' do
    before do
      @sample = FactoryBot.create(:sample)
    end

    context '管理者ユーザーでログインした場合' do
      before do
        admin_user = FactoryBot.create(:admin_user)
        log_in(admin_user)
      end

      it '削除用リンクが表示されること' do
        visit sample_path(@sample)
        expect(page).to have_link('Destroy', count: 1)
      end
    end
    context '一般ユーザーでログインした場合' do
      before do
        general_user = FactoryBot.create(:general_user)
        log_in(general_user)
      end

      it '削除用リンクが表示されないこと' do
        visit sample_path(@sample)
        expect(page).to have_link('Destroy', count: 0)
      end
    end
  end

  describe '#create' do
    before do
      FactoryBot.create(:category, item: 'めっき')
      general_user = FactoryBot.create(:general_user)
      log_in(general_user)
    end

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
        expect(page).to have_selector('div', text: 'Successful registration of new surface treatment!')
        expect(page).to have_selector('h3',  text: 'Surface Treatment Information')
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
        expect(page).to have_selector('div', text: 'Name can\'t be blank')
        expect(page).to have_selector('h3',  text: 'New Registration for Surface Treatment')
      end
    end
  end

  describe '#update' do
    before do
      @sample = FactoryBot.create(:sample)
    end

    context 'ログイン済みで' do
      before do
        general_user = FactoryBot.create(:general_user)
        log_in(general_user)
      end

      context '有効な値を入力した場合' do
        it '更新できること' do
          visit edit_sample_path(@sample)
          fill_in('Name', with: '亜鉛めっき')
          click_button('Update Sample')
          expect(page).to have_selector('div', text: 'Successful updated sample information!')
          expect(page).to have_selector('h3',  text: 'Surface Treatment Information')
        end
      end
      context '無効な値を入力した場合' do
        it '更新できないこと' do
          visit edit_sample_path(@sample)
          fill_in('Name', with: '')
          click_button('Update Sample')
          expect(page).to have_selector('div', text: 'Name can\'t be blank')
          expect(page).to have_selector('h3',  text: 'Edit for Surface Treatment')
        end
      end
    end
    context '未ログインの場合' do
      it 'ログインページにリダイレクトされること' do
        visit edit_sample_path(@sample)
        expect(page).to have_selector('h3',  text: 'Log in')
        expect(page).to have_selector('div', text: 'Please log in.')
      end
    end
  end

  describe '#destroy' do
    before do
      @sample = FactoryBot.create(:sample)
      admin_user = FactoryBot.create(:admin_user)
      log_in(admin_user)
    end

    it 'samples/indexページが表示されること' do
      visit sample_path(@sample)
      click_link('Destroy')
      expect(page).to have_selector('h3',  text: 'Surface Treatment List')
      expect(page).to have_selector('div', text: 'Successful deleted surface treatment!')
    end
  end
end
