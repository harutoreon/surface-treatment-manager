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

    it 'タイトルが表示されること' do
      get home_path
      expect(response.body).to include('<title>Main Menu</title>')
    end
  end

  describe '#name' do
    it 'レスポンスが正常であること' do
      get category_name_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get category_name_path
      expect(response.body).to include("Search by treatment")
    end

    it 'タイトルが表示されること' do
      get category_name_path
      expect(response.body).to include('<title>Search by treatment</title>')
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

    it 'タイトルが表示されること' do
      get category_category_path
      expect(response.body).to include('<title>Search Category</title>')
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

    it 'タイトルが表示されること' do
      get category_maker_path
      expect(response.body).to include('<title>Search Maker</title>')
    end
  end
end
