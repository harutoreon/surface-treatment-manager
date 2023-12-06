require 'rails_helper'

RSpec.describe "StaticPages", type: :request do
  describe "#home" do
    it "レスポンスが正常であること" do
      get root_path
      expect(response).to have_http_status(:success)
    end

    it 'Welcomeメッセージが表示されること' do
      get root_path
      expect(response.body).to include "Welcome to Surface Treatment Manager"
    end

    it 'samples/indexのリンクが存在すること' do
      get root_path
      expect(response.body).to include "<a href=\"#{samples_path}\">"
    end
  end
end
