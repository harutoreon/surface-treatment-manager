require 'rails_helper'

RSpec.describe "Searches", type: :request do
  before do
    FactoryBot.create_list(:sample_list, 5)
  end

  describe '#name_search' do
    it 'レスポンスのステータスがsuccessであること' do
      get '/name_search'
      expect(response).to have_http_status(:success)
    end

    it 'レスポンスのjsonに:samplesと:keywordが含まれていること' do
      get '/name_search', params: { keyword: 'めっき' }
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json.include?(:samples)).to be(true)
      expect(json.include?(:keyword)).to be(true)
      expect(json[:samples].count).to eq(5)
      expect(json[:keyword]).to eq('めっき')
    end
  end

  describe '#category_search' do
    it 'レスポンスのステータスがsuccessであること' do
      get '/category_search'
      expect(response).to have_http_status(:success)
    end

    it 'レスポンスのjsonに:samplesと:keywordが含まれていること' do
      get '/category_search', params: { keyword: 'めっき' }
      json = JSON.parse(response.body, symbolize_names: true)

      expect(json.include?(:samples)).to be(true)
      expect(json.include?(:keyword)).to be(true)
      expect(json[:samples].count).to eq(5)
      expect(json[:keyword]).to eq('めっき')
    end
  end

  describe '#maker_search' do
    it 'レスポンスのステータスがsuccessであること' do
      get '/maker_search'
      expect(response).to have_http_status(:success)
    end

    it 'レスポンスのjsonに:samplesと:keywordが含まれていること' do
      get '/maker_search', params: { keyword: '株式会社' }
      json = JSON.parse(response.body, symbolize_names: true)

      expect(json.include?(:samples)).to be(true)
      expect(json.include?(:keyword)).to be(true)
      expect(json[:samples].count).to eq(5)
      expect(json[:keyword]).to eq('株式会社')
    end
  end
end
