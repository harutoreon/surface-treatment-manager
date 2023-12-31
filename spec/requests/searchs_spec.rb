require 'rails_helper'

RSpec.describe "Searchs", type: :request do
  describe "GET /search" do
    it "returns http success" do
      get "/searchs/search"
      expect(response).to have_http_status(:success)
    end
  end

end
