require 'rails_helper'

RSpec.describe "Users API", type: :request do
  describe '#index' do
    let!(:user){ FactoryBot.create(:user) }

    it 'レスポンスのステータスがokであること' do
      get users_path
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスにusers/current_page/total_pagesが含まれていること' do
      get users_path
      expect(response.parsed_body['users'].size).to eq(1)
      expect(response.parsed_body['current_page']).to eq(1)
      expect(response.parsed_body['total_pages']).to eq(1)
    end
  end

  describe '#show' do
    let(:user) { FactoryBot.create(:user) }

    it 'レスポンスのステータスがokであること' do
      get user_path(user)
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスのレコードに過不足なく属性が含まれていること' do
      get user_path(user)
      json = response.parsed_body
      expect(json[:name]).to eq(user.name)
      expect(json[:department]).to eq(user.department)
    end
  end

  describe '#create' do
    let(:params) do
      { user:
          { name: name,
            department: '品質管理部',
            password: 'password',
            password_confirmation: 'password' } }
    end

    context '有効なユーザー情報で登録したとき' do
      let(:name) { 'sample user' }

      it 'レスポンスのステータスがcreatedであること' do
        post users_path, params: params
        expect(response).to have_http_status(:created)
      end

      it 'データベースのユーザー数が増加し、headerのlocationが追加されること' do
        expect{ post users_path, params: params }.to change{ User.count }.from(0).to(1)

        user = User.last
        expect(response.header["Location"]).to eq(user_url(user))
      end
    end

    context '無効なユーザー情報で登録したとき' do
      let(:name) { '' }

      it 'レスポンスのステータスがunprocessable_contentであること' do
        post users_path, params: params
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'データベースに登録されないこと' do
        expect{ post users_path, params: params }.to_not change{ User.count }.from(0)
        expect(response.parsed_body[:name]).to include('ユーザー名が空白です。')
      end
    end
  end

  describe '#update' do
    let!(:user) { FactoryBot.create(:user) }

    context '有効なユーザー情報で更新したとき' do
      it 'レスポンスのステータスがokであること' do
        patch user_path(user), params: { user: { name: 'sample user' } }
        expect(response).to have_http_status(:ok)
      end

      it 'nameがsample userで更新されること' do
        patch user_path(user), params: { user: { name: 'sample user' } }
        expect(user.reload.name).to eq('sample user')
      end
    end

    context '無効なユーザー情報で更新したとき' do
      it 'レスポンスがunprocessable_contentであること' do
        patch user_path(user), params: { user: { name: '' } }
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'ユーザー名が空白で更新できないこと' do
        patch user_path(user), params: { user: { name: '' } }
        expect(user.reload.name).to eq('Michael Hartl')
        expect(response.parsed_body[:name]).to include('ユーザー名が空白です。')
      end
    end
  end

  describe '#destroy' do
    let!(:user) { FactoryBot.create(:user) }

    it 'レスポンスのステータスがno_contentであること' do
      delete user_path(user)
      expect(response).to have_http_status(:no_content)
    end

    it 'ユーザーの削除に成功し、レスポンスの本文は空であること' do
      expect { delete user_path(user) }.to change{ User.count }.from(1).to(0)
      expect(response.body).to be_blank
    end
  end

  describe '#user_list' do
    let!(:user) { FactoryBot.create(:user) }

    it 'レスポンスのステータスがokであること' do
      get user_list_path
      expect(response).to have_http_status(:ok)
    end

    it 'name属性とdepartment属性が含まれていること' do
      get user_list_path
      user = User.first
      json = response.parsed_body.first
      expect(json).to include(:name, :department)
      expect(json[:name]).to eq(user.name)
      expect(json[:department]).to eq(user.department)
    end
  end
end
