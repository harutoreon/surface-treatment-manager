require 'rails_helper'

RSpec.describe "Home", type: :request do
  describe "#index" do
    it "レスポンスのステータスがsuccessであること" do
      get "/"
      expect(response).to have_http_status(:ok)
    end
  end
end
