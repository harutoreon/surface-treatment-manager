require 'rails_helper'

RSpec.describe 'CommentsManagementFlowSpec', type: :system do
  before do
    @sample = FactoryBot.create(:sample)
  end

  describe '#create' do
    before do
      general_user = FactoryBot.create(:general_user)
      log_in(general_user)
    end

    context '有効な値の場合' do
      it '登録に成功すること' do
        visit sample_path(@sample)
        fill_in('部署名と名前を入力', with: 'sample commenter')
        fill_in('コメントはここに入力', with: 'sample comment.')
        click_button('追加')
        expect(page).to have_selector('div', text: 'コメントを1件追加しました。')
        expect(page).to have_selector('h3',  text: '表面処理情報')
        expect(page).to have_selector('h6',  text: 'sample commenter')
        expect(page).to have_selector('h6',  text: 'sample comment.')
      end
    end
    context '無効な値の場合' do
      it '登録に失敗すること' do
        visit sample_path(@sample)
        fill_in('部署名と名前を入力', with: '')
        fill_in('コメントはここに入力', with: 'sample comment.')
        click_button('追加')
        expect(page).to have_selector('div', text: 'コメントの投稿者またはコメントが無効です。')
        expect(page).to have_selector('h3',  text: '表面処理情報')
        expect(page).to_not have_selector('h6',  text: 'sample commenter')
        expect(page).to_not have_selector('h6',  text: 'sample comment.')
      end
    end
  end

  describe '#destroy' do
    before do
      @comment = @sample.comments.create(commenter: 'sample commenter', body: 'sample comment.')
      admin_user = FactoryBot.create(:admin_user)
      log_in(admin_user)
    end

    it '削除に成功すること' do
      visit sample_path(@sample)
      click_link('削除', href: sample_comment_path(@sample, @sample.comments.first.id))
      expect(page).to have_selector('h3', text: '表面処理情報')
      expect(page).to_not have_selector('h6', text: 'sample commenter')
      expect(page).to_not have_selector('h6', text: 'sample comment.')
    end
  end
end
