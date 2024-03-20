require 'rails_helper'

RSpec.describe "Users", type: :system do
  before do
    driven_by(:rack_test)
  end

  describe '#show' do
    let!(:admin)      { FactoryBot.create(:user) }
    let!(:not_admin)  { FactoryBot.create(:archer) }
    let!(:other_user) { FactoryBot.create(:michael) }

    # it 'ログインユーザーが管理者なら削除リンクが表示されること' do
    #   log_in(admin)
    #   visit user_path(other_user)

    #   expect(page).to have_link("User Information")
    # end
  end
end
