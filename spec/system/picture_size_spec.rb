require 'rails_helper'

RSpec.describe "PictureSize", type: :system do
  describe '#picture_size' do
    before do
      FactoryBot.create(:category, item: 'めっき')
    end

    context '画像サイズが5MBを超える場合は' do
      it '検証エラーが発生すること' do
        visit new_sample_path
        fill_in('Name', with: '無電解ニッケルめっき')
        select("めっき", from: 'sample_category')
        fill_in('Color', with: 'ゴールド')
        fill_in('Maker', with: '株式会社中川鉱業')
        fill_in('Hardness', with: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
        fill_in('Film thickness', with: '通常は3～5μm、厚めの場合は20～50μmまで可能')
        fill_in('Feature', with: '耐食性・耐摩耗性・耐薬品性・耐熱性')
        attach_file('Picture', 'spec/fixtures/invalid_image.jpeg')
        click_button('Create Sample')
        expect(page).to have_selector('div', text: 'should be less than 5MB')
        expect(page).to have_selector('h3',  text: 'New Registration for Surface Treatment')
      end
    end
  end
end
