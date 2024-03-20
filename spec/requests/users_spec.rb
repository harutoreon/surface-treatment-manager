require 'rails_helper'

RSpec.describe "Users", type: :request do
  describe '#index' do
    before do
      admin = FactoryBot.create(:admin)
      log_in(admin)
    end

    it 'レスポンスが正常であること' do
      get users_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get users_path
      expect(response.body).to include('User List')
    end

    it 'タイトルが表示されること' do
      get users_path
      expect(response.body).to include('<title>User List</title>')
    end
  end

  describe '#show' do
    before do
      @admin = FactoryBot.create(:admin)
      log_in(@admin)
    end

    it 'レスポンスが正常であること' do
      get user_path(@admin)
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get user_path(@admin)
      expect(response.body).to include('User Show')
    end

    it 'タイトルが表示されること' do
      get user_path(@admin)
      expect(response.body).to include('<title>User Show</title>')
    end
  end

  describe "#new" do
    before do
      admin = FactoryBot.create(:admin)
      log_in(admin)
    end

    it "レスポンスが正常であること" do
      get new_user_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get new_user_path
      expect(response.body).to include('User New')
    end

    it 'タイトルが表示されること' do
      get new_user_path
      expect(response.body).to include('<title>User New</title>')
    end
  end

  describe '#create' do
    before do
      admin = FactoryBot.create(:admin)
      log_in(admin)
    end

    context '有効なユーザー情報のとき' do
      let(:user_params) { { user: { name: "sample user", password: "password", password_confirmation: "password" } } }

      it '登録が成功すること' do
        expect{ post users_path, params: user_params }.to change{ User.count }.from(1).to(2)
      end

      it 'users/showページにリダイレクトすること' do
        post users_path, params: user_params
        new_user = User.last
        expect(response).to redirect_to new_user
      end
    end

    context '無効なユーザー情報のとき' do
      let(:user_params) { { user: { name: "", password: "password", password_confirmation: "password" } } }

      it '登録が失敗すること' do
        expect{ post users_path, params: user_params }.to_not change{ User.count }.from(1)
      end

      it 'users/newページが表示されること' do
        post users_path, params: user_params
        expect(response.body).to include('User New')
      end
    end
  end

  describe '#edit' do
    before do
      @admin = FactoryBot.create(:admin)
      log_in(@admin)
    end

    it 'レスポンスが正常であること' do
      get edit_user_path(@admin)
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get edit_user_path(@admin)
      expect(response.body).to include("User Edit")
    end

    it 'タイトルが表示されること' do
      get edit_user_path(@admin)
      expect(response.body).to include('<title>User Edit</title>')
    end
  end

  describe '#update' do
    before do
      admin = FactoryBot.create(:admin)
      log_in(admin)
      @non_admin = FactoryBot.create(:non_admin)
    end

    context '有効な値の場合' do
      it '更新できること' do
        patch user_path(@non_admin), params: { user: { name: 'sample user' } }
        @non_admin.reload
        expect(@non_admin.name).to eq('sample user')
      end

      it 'users/showページにリダイレクトされること' do
        patch user_path(@non_admin), params: { user: { name: 'sample user' } }
        expect(response).to redirect_to @non_admin
      end

      it 'フラッシュメッセージが表示されていること' do
        patch user_path(@non_admin), params: { user: { name: 'sample user' } }
        expect(flash).to be_any
      end
    end

    context '無効な値の場合' do
      it '更新できないこと' do
        patch user_path(@non_admin), params: { user: { name: '' } }
        @non_admin.reload
        expect(@non_admin.name).to_not eq('')
      end

      it 'users/editページが表示されること' do
        patch user_path(@non_admin), params: { user: { name: '' } }
        expect(response.body).to include('User Edit')
      end
    end
  end

  describe '#destroy' do
    before do
      admin = FactoryBot.create(:admin)
      log_in(admin)
      @non_admin = FactoryBot.create(:non_admin)
    end

    it '削除できること' do
      expect { delete user_path(@non_admin) }.to change{ User.count }.from(2).to(1)
    end

    it 'users#indexにリダイレクトされること' do
      delete user_path(@non_admin)
      expect(response).to redirect_to users_url
    end

    it 'フラッシュメッセージが表示されること' do
      delete user_path(@non_admin)
      expect(flash).to be_any
    end
  end
end
