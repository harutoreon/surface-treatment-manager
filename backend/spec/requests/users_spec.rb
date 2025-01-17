require 'rails_helper'

RSpec.describe "Users API", type: :request do
  describe '#index' do
    before do
      FactoryBot.create_list(:user_list, 10)
    end

    it 'レスポンスのステータスがsuccessであること' do
      get "/users.json"
      expect(response).to have_http_status(:success)
    end

    it 'json形式のユーザーリストが10件返ること' do
      get "/users.json"
      json = JSON.parse(response.body)
      expect(json.count).to eq(10)
    end
  end

  describe '#show' do
    before do
      @user = FactoryBot.create(:user)
    end

    it 'レスポンスのステータスがsuccessであること' do
      get "/users/#{@user.id}.json"
      expect(response).to have_http_status(:success)
    end

    it 'json形式のユーザー情報が返ること' do
      get "/users/#{@user.id}.json"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json[:name]).to eq('Michael Hartl')
      expect(json[:department]).to eq('品質管理部')
    end
  end

  describe '#create' do
    context '有効なユーザー情報で登録したとき' do
      before do
        @valid_user_params = { user: { name: 'sample user',
                                       department: '品質管理部',
                                       password: 'password',
                                       password_confirmation: 'password' } }
      end

      it 'レスポンスのステータスがcreatedであること' do
        post "/users", params: @valid_user_params
        expect(response).to have_http_status(:created)
      end

      it 'headerのlocationが登録したユーザーを参照していること' do
        post "/users", params: @valid_user_params
        user = User.last
        expect(response.header["Location"]).to eq("http://www.example.com/users/#{user.id}")
      end

      it 'データベースのユーザー数が1増えること' do
        expect{ post "/users", params: @valid_user_params }.to change{ User.count }.from(0).to(1)
      end
    end

    context '無効なユーザー情報で登録したとき' do
      before do
        @invalid_user_params = { user: { name: '',
                                         department: '品質管理部',
                                         password: 'password',
                                         password_confirmation: 'password' } }
      end

      it 'レスポンスのステータスがunprocessable_entityであること' do
        post "/users", params: @invalid_user_params
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'データベースに登録されないこと' do
        expect{ post "/users", params: @invalid_user_params }.to_not change{ User.count }.from(0)
      end
    end
  end

  describe '#update' do
    before do
      @user = FactoryBot.create(:archer)
    end

    context '有効なユーザー情報で更新したとき' do
      it 'nameがsample userで更新されること' do
        patch "/users/#{@user.id}", params: { user: { name: 'sample user' } }
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:name]).to eq('sample user')
      end
    end

    context '無効なユーザー情報で更新したとき' do
      it 'レスポンスがunprocessable_entityであること' do
        patch "/users/#{@user.id}", params: { user: { name: '' } }
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'ユーザー名が空白で更新できないこと' do
        patch "/users/#{@user.id}", params: { user: { name: '' } }
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:name]).to eq(["（ユーザー名）が空白です。"])
      end
    end
  end

  describe '#destroy' do
    before do
      @user = FactoryBot.create(:sample_user)
    end

    it 'ユーザーの削除に成功すること' do
      expect { delete "/users/#{@user.id}" }.to change{ User.count }.from(1).to(0)
    end
  end
end
