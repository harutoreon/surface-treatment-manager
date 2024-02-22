require 'rails_helper'

RSpec.describe "StaticPages", type: :request do
  before do
    user = FactoryBot.create(:user)
    log_in(user)
  end

  describe "#home" do
    it "レスポンスが正常であること" do
      get home_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get home_path
      expect(response.body).to include("Main Menu")
    end
  end

  describe '#name' do
    it 'レスポンスが正常であること' do
      get category_name_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get category_name_path
      expect(response.body).to include("Search Name")
    end
  end

  describe '#category' do
    it 'レスポンスが正常であること' do
      get category_category_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get category_category_path
      expect(response.body).to include("Search Category")
    end
  end

  describe '#maker' do
    it 'レスポンスが正常であること' do
      get category_maker_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get category_maker_path
      expect(response.body).to include("Search Maker")
    end
  end
end
