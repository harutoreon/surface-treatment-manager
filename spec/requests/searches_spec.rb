require 'rails_helper'

RSpec.describe "Searches", type: :request do
  before do
    @user = FactoryBot.create(:user)
    log_in(@user)
  end

  describe "#search" do
    before do
      5.times do
        FactoryBot.create(:sample_list)
      end
    end

    it "レスポンスが正常であること" do
      get search_path, params: { search: 'partial', word: 'めっき' }
      expect(response).to have_http_status(:success)
    end

    it '"めっき"を含んだ処理名が表示されること' do
      get search_path, params: { search: 'partial', word: 'めっき' }
      expect(response.body).to include("無電解ニッケルめっき")
    end
  end
end
