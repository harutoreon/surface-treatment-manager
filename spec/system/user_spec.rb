require 'rails_helper'

RSpec.describe "Users", type: :system do
  before do
    driven_by(:rack_test)
  end

  describe '#show' do
    let!(:admin)      { FactoryBot.create(:user) }
    let!(:not_admin)  { FactoryBot.create(:archer) }
    let!(:other_user) { FactoryBot.create(:michael) }

    it '管理者ユーザーなら削除リンクが表示されること' do
      log_in(admin)
      visit user_path(other_user)

      expect(page).to have_link("User destroy")
    end

    it '管理者ユーザーでなければ削除リンクが表示されないこと' do
      log_in(not_admin)
      visit user_path(other_user)

      expect(page).to_not have_link("User destroy")
    end
  end
end
