require 'rails_helper'

RSpec.describe "Home", type: :request do
  describe "#index" do
    it "レスポンスのステータスがokであること" do
      get "/"
      expect(response).to have_http_status(:ok)
    end
  end
end
