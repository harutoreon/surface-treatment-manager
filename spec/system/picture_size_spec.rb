require 'rails_helper'

RSpec.describe "PictureSize", type: :system do
  describe '#picture_size' do
    before do
      FactoryBot.create(:category, item: 'めっき')
    end

    context '画像サイズが5MBを超える場合は' do
      it '検証エラーが発生すること' do
        visit new_sample_path
        fill_in('処理名', with: '無電解ニッケルめっき')
        select("めっき", from: 'sample_category')
        fill_in('色調', with: 'ゴールド')
        fill_in('メーカー', with: '株式会社中川鉱業')
        fill_in('硬度', with: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度')
        fill_in('膜厚', with: '通常は3～5μm、厚めの場合は20～50μmまで可能')
        fill_in('特徴', with: '耐食性・耐摩耗性・耐薬品性・耐熱性')
        attach_file('画像', 'spec/fixtures/invalid_image.jpeg')
        click_button('登録')
        expect(page).to have_selector('div', text: '（画像）のサイズは5MB以下であること')
        expect(page).to have_selector('h3',  text: '表面処理情報の登録')
      end
    end
  end
end
