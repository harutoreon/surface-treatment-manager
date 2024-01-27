require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  describe "#new" do
    it "レスポンスが正常であること" do
      get root_path
      expect(response).to have_http_status(:success)
    end
  end

  describe '#destroy' do
    it 'ログアウトできること' do
      user = FactoryBot.create(:user)
      post login_path, params: { session: { name: user.name, password: user.password } }
      expect(logged_in?).to be_truthy

      delete logout_path
      expect(logged_in?).to_not be_truthy
    end
  end
end
