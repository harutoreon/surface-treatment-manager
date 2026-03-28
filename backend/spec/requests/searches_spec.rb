require 'rails_helper'

RSpec.describe "Searches", type: :request do
  let!(:sample) { FactoryBot.create(:sample) }

  describe '#name_search' do
    it 'レスポンスのステータスがokであること' do
      get name_search_path, params: { keyword: 'めっき' }
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスにsamplesとkeywordが含まれていること' do
      get name_search_path, params: { keyword: 'めっき' }
      json = response.parsed_body
      expect(json[:samples].size).to eq(1)
      expect(json[:keyword]).to eq('めっき')
    end
  end

  describe '#category_search' do
    it 'レスポンスのステータスがokであること' do
      get category_search_path, params: { keyword: 'めっき' }
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスにsamplesとkeywordが含まれていること' do
      get category_search_path, params: { keyword: 'めっき' }
      json = response.parsed_body
      expect(json[:samples].size).to eq(1)
      expect(json[:keyword]).to eq('めっき')
    end
  end

  describe '#maker_search' do
    it 'レスポンスのステータスがokであること' do
      get maker_search_path, params: { keyword: '松本情報合名会社' }
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスにsamplesとkeywordが含まれていること' do
      get maker_search_path, params: { keyword: '松本情報合名会社' }
      json = response.parsed_body
      expect(json[:samples].size).to eq(1)
      expect(json[:keyword]).to eq('松本情報合名会社')
    end
  end

  describe '#list_search' do
    it 'レスポンスのステータスがokであること' do
      get list_search_path
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスのレコードに過不足なく属性が含まれていること' do
      get list_search_path
      expect(response.parsed_body.size).to eq(1)

      expect(
        response.parsed_body.first.keys
      ).to match_array(%w(id name summary image_url))
    end
  end
end
