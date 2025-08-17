require 'rails_helper'

RSpec.describe "Users API", type: :request do
  describe '#index' do
    before do
      FactoryBot.create_list(:user_list, 8)
    end

    it 'レスポンスのステータスがokであること' do
      get "/users"
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスのusersは8件であること' do
      get "/users"
      json = JSON.parse(response.body)
      expect(json['users'].length).to eq(8)
    end

    it 'レスポンスのcurrent_pageは1であること' do
      get "/users"
      json = JSON.parse(response.body)
      expect(json['current_page']).to eq(1)
    end
    
    it 'レスポンスのtotal_pagesは1であること' do
      get "/users"
      json = JSON.parse(response.body)
      expect(json['total_pages']).to eq(1)
    end

    it 'レスポンスに管理者ユーザーと一般ユーザーが含まれてないこと' do
      get "/users"
      json = JSON.parse(response.body)
      expect(json['users'].count).to eq(8)

      FactoryBot.create(:admin_user)
      FactoryBot.create(:general_user)

      get "/users"
      user_added_json = JSON.parse(response.body)
      expect(json['users'] == user_added_json['users']).to eq(true)
    end
  end

  describe '#show' do
    before do
      @user = FactoryBot.create(:user)
    end

    it 'レスポンスのステータスがokであること' do
      get "/users/#{@user.id}.json"
      expect(response).to have_http_status(:ok)
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
      it 'レスポンスのステータスがokであること' do
        patch "/users/#{@user.id}", params: { user: { name: 'sample user' } }
        expect(response).to have_http_status(:ok)
      end

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

    it 'レスポンスのステータスがno_contentであること' do
      delete "/users/#{@user.id}"
      expect(response).to have_http_status(:no_content)
    end

    it 'レスポンスの本文が空であること' do
      delete "/users/#{@user.id}"
      expect(response.body).to be_blank
    end

    it 'ユーザーの削除に成功すること' do
      expect { delete "/users/#{@user.id}" }.to change{ User.count }.from(1).to(0)
    end
  end
end
