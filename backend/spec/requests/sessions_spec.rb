require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  describe '#create' do
    let!(:general) { FactoryBot.create(:general_user) }
    let(:params) { { name: 'general user', password: password } }

    context '認証に成功した場合' do
      let(:password) { 'generalpassword' }

      it 'レスポンスのステータスコードが ok であること' do
        post login_path, params: params
        expect(response).to have_http_status(:ok)
      end

      it 'レスポンスにトークンが含まれていること' do
        post login_path, params: params
        expect(response.parsed_body).to include(:token)
      end
    end

    context '認証に失敗した場合' do
      let(:password) { '' }

      it 'レスポンスのステータスが unauthorized であること' do
        post login_path, params: params
        expect(response).to have_http_status(:unauthorized)
      end

      it 'エラーメッセージが返ること' do
        post login_path, params: params
        expect(response.parsed_body[:error]).to eq('invalid credentials')
      end
    end
  end

  describe '#logged_in' do
    let(:headers) do
      { Authorization: authorization, Accept: 'application/json', }
    end

    context 'クライアントから有効なトークンが提供された場合' do
      let(:valid_token) { JsonWebToken.encode(user_id: 1) }
      let(:authorization) { "Bearer #{valid_token}" }

      it 'レスポンスのステータスが ok であること' do
        get logged_in_path, headers: headers
        expect(response).to have_http_status(:ok)
      end

      it 'ペイロードが返ること' do
        get logged_in_path, headers: headers
        expect(response.parsed_body[:payload]).to include( user_id: 1 )
      end
    end
    
    context 'クライアントから無効なトークンが提供された場合' do
      let(:invalid_token) { 'invalid.token.string' }
      let(:authorization) { invalid_token }

      it 'レスポンスのステータスが unauthorized であること' do
        get logged_in_path, headers: headers
        expect(response).to have_http_status(:unauthorized)
      end

      it 'エラーメッセージが返ること' do
        get logged_in_path, headers: headers
        expect(response.parsed_body[:errors]).to eq('invalid token')
      end
    end
  end
end
