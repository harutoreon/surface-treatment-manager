require 'rails_helper'

RSpec.describe "Makers", type: :request do
  describe "show" do
    before do
      @maker = FactoryBot.create(:maker)
    end

    it 'レスポンスが正常であること' do
      get maker_path(@maker)
      expect(response).to have_http_status(:success)
    end

    it 'タイトルが表示されること' do
      get maker_path(@maker)
      expect(response.body).to include('<title>Maker Information</title>')
    end
  end
end
