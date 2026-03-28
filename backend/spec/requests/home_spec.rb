require 'rails_helper'

RSpec.describe "Home", type: :request do
  describe "#index" do
    it "レスポンスのステータスがokであること" do
      get root_path
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスに期待されるメッセージが含まれていること' do
      get root_path
      expect(response.parsed_body[:message]).to eq('API Root')
    end
  end
end
