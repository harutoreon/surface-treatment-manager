require 'rails_helper'

RSpec.describe "Settings", type: :request do
  describe "#home" do
    it "レスポンスが正常であること" do
      get setting_path
      expect(response).to have_http_status(:success)
    end

    it 'タイトルが表示されること' do
      get setting_path
      expect(response.body).to include('<title>Application Setting</title>')
    end
  end
end
