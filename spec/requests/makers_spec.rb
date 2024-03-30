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

  describe 'new' do
    it 'レスポンスが正常であること' do
      get new_maker_path
      expect(response).to have_http_status(:success)
    end

    it 'タイトルが表示されること' do
      get new_maker_path
      expect(response.body).to include('<title>New Registration for Maker</title>')
    end
  end
end
