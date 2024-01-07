require 'rails_helper'

RSpec.describe "Users", type: :request do
  describe "#new" do
    it "レスポンスが正常であること" do
      get signup_path
      expect(response).to have_http_status(:success)
    end
  end

  describe '#create' do
    context '無効なユーザー情報のとき' do
      let(:user_params) { { user: { name: "", password: "foobar", password_confirmation: "foobar" } } }

      it '登録が失敗すること' do
        expect{ post users_path, params: user_params }.to_not change{ User.count }.from(0)
      end
    end

    context '有効なユーザー情報のとき' do
      let(:user_params) { { user: { name: "foobar", password: "foobar", password_confirmation: "foobar" } } }

      it '登録が成功すること' do
        expect{ post users_path, params: user_params }.to change{ User.count }.from(0).to(1)
      end
    end
  end
end
