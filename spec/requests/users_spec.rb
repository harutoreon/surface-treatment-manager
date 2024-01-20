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

      it 'ログイン状態であること' do
        post users_path, params: user_params
        expect(logged_in?).to be_truthy
      end
    end
  end

  describe '#edit' do
    let!(:user) { FactoryBot.create(:user) }

    it 'レスポンスが正常であること' do
      get edit_user_path(user)
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get edit_user_path(user)
      expect(response.body).to include("User Edit")
    end
  end

  describe '#update' do
    let!(:user) { FactoryBot.create(:user) }

    context '無効な値の場合' do
      it '更新できないこと' do
        patch user_path(user), params: { user: { name: '', password: 'foo', password_confirmation: 'bar' } }

        user.reload
        expect(user.name).to_not eq('')
        expect(user.password).to_not eq('foo')
        expect(user.password_confirmation).to_not eq('bar')
      end
    end
  end
end
