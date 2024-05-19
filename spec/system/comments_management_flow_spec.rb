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
        fill_in('Commenter', with: 'sample commenter')
        fill_in('Comment',   with: 'sample comment.')
        click_button('Create Comment')
        expect(page).to have_selector('div', text: '1 comment added.')
        expect(page).to have_selector('h3',  text: 'Surface Treatment Information')
        expect(page).to have_selector('h6',  text: 'sample commenter')
        expect(page).to have_selector('h6',  text: 'sample comment.')
      end
    end
    context '無効な値の場合' do
      it '登録に失敗すること' do
        visit sample_path(@sample)
        fill_in('Commenter', with: '')
        fill_in('Comment',   with: 'sample comment.')
        click_button('Create Comment')
        expect(page).to have_selector('div', text: 'Invalid commenter or comment.')
        expect(page).to have_selector('h3',  text: 'Surface Treatment Information')
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
      click_link('Destroy', href: sample_comment_path(@sample, @sample.comments.first.id))
      expect(page).to have_selector('h3', text: 'Surface Treatment Information')
      expect(page).to_not have_selector('h6', text: 'sample commenter')
      expect(page).to_not have_selector('h6', text: 'sample comment.')
    end
  end
end
