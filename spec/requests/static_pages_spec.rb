require 'rails_helper'

RSpec.describe "StaticPages", type: :request do
  describe "#home" do
    it "returns http success" do
      get root_path
      expect(response).to have_http_status(:success)
    end

    it 'The welcome message should be displayed' do
      get root_path
      expect(response.body).to include "Welcome to Surface Treatment Manager!!"
    end

    it 'The link to the index page must exist' do
      get root_path
      expect(response.body).to include "<a href=\"#{samples_path}\">"
    end
  end
end
