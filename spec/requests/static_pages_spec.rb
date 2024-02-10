require 'rails_helper'

RSpec.describe "StaticPages", type: :request do
  describe "#home" do
    before do
      @user = FactoryBot.create(:user)
      log_in(@user)
    end

    it "レスポンスが正常であること" do
      get home_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get home_path
      expect(response.body).to include("Search Menu")
    end
  end

  describe '#name' do
    before do
      @user = FactoryBot.create(:user)
      log_in(@user)
    end

    it 'レスポンスが正常であること' do
      get name_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get name_path
      expect(response.body).to include("Search Name")
    end
  end

  describe '#category' do
    before do
      @user = FactoryBot.create(:user)
      log_in(@user)
    end

    it 'レスポンスが正常であること' do
      get category_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get category_path
      expect(response.body).to include("Search Category")
    end
  end

  describe '#maker' do
    before do
      @user = FactoryBot.create(:user)
      log_in(@user)
    end

    it 'レスポンスが正常であること' do
      get maker_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get maker_path
      expect(response.body).to include("Search Maker")
    end
  end
end
