require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  describe "#new" do
    it "レスポンスが正常であること" do
      get root_path
      expect(response).to have_http_status(:success)
    end

    it 'タイトルが表示されること' do
      get root_path
      expect(response.body).to include('<title>ログイン</title>')
    end
  end

  describe '#destroy' do
    before do
      user = FactoryBot.create(:user)
      log_in(user)
    end

    it 'ステータスコード303が返ること' do
      delete logout_path
      expect(response).to have_http_status(:see_other)
    end

    it 'ログイン画面にリダイレクトされること' do
      delete logout_path
      expect(response).to redirect_to login_url
    end

    it '@current_userが空であること' do
      delete logout_path
      expect(logged_in?).to_not be_truthy
    end
  end
end
