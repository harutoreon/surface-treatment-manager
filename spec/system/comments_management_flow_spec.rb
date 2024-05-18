require 'rails_helper'

RSpec.describe 'CommentsManagementFlowSpec', type: :system do
  before do
    @sample = FactoryBot.create(:sample)
  end

  describe '#create' do
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
    end

    context 'ログイン済みの場合' do
      before do
        user = FactoryBot.create(:user)
        log_in(user)
      end

      it '削除に成功すること' do
        visit sample_path(@sample)
        click_link('Destroy', href: sample_comment_path(@sample, @sample.comments.first.id))
        expect(page).to have_selector('h3',     text: 'Surface Treatment Information')
        expect(page).to_not have_selector('h6', text: 'sample commenter')
        expect(page).to_not have_selector('h6', text: 'sample comment.')
      end
    end
    context '未ログインの場合' do
      it 'ログインページにリダイレクトされること' do
        visit sample_path(@sample)
        click_link('Destroy', href: sample_comment_path(@sample, @sample.comments.first.id))
        expect(page).to have_selector('h3',  text: 'Log in')
        expect(page).to have_selector('div', text: 'Please log in.')
      end
    end
  end
end
