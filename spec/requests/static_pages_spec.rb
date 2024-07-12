require 'rails_helper'

RSpec.describe "StaticPages", type: :request do
  describe "#home" do
    before do
      user = FactoryBot.create(:user)
      log_in(user)
    end

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
    it 'タイトルが表示されること' do
      get category_name_path
      expect(response.body).to include('<title>処理名で検索</title>')
    end
  end

  describe '#category' do
    it 'レスポンスが正常であること' do
      get category_category_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get category_category_path
      expect(response.body).to include("Search by category")
    end

    it 'タイトルが表示されること' do
      get category_category_path
      expect(response.body).to include('<title>Search by category</title>')
    end
  end

  describe '#maker' do
    it 'レスポンスが正常であること' do
      get category_maker_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get category_maker_path
      expect(response.body).to include("Search by maker")
    end

    it 'タイトルが表示されること' do
      get category_maker_path
      expect(response.body).to include('<title>Search by maker</title>')
    end
  end
end
