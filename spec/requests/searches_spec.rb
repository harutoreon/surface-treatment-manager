require 'rails_helper'

RSpec.describe "Searches", type: :request do
  before do
    @user = FactoryBot.create(:user)
    log_in(@user)
  end

  describe "#search" do
    before do
      5.times do
        FactoryBot.create(:sample_list)
      end
    end

    it "レスポンスが正常であること" do
      get search_path, params: { search: 'partial', word: 'めっき' }
      expect(response).to have_http_status(:success)
    end

    it '"めっき"を含んだ処理名が表示されること' do
      get search_path, params: { search: 'partial', word: 'めっき' }
      expect(response.body).to include("無電解ニッケルめっき")
    end
  end

  describe '#name_search' do
    before do
      5.times do
        FactoryBot.create(:sample_list)
      end
    end

    it 'レスポンスが正常であること' do
      get name_search_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get name_search_path
      expect(response.body).to include("Search Result")
    end

    it '"めっき"を含んだ処理名が表示されること' do
      get name_search_path, params: { keyword: 'めっき' }
      expect(response.body).to include("無電解ニッケルめっき")
    end
  end

  describe '#category_search' do
    before do
      5.times do
        FactoryBot.create(:sample_list)
      end
    end

    it 'レスポンスが正常であること' do
      get category_search_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get category_search_path
      expect(response.body).to include("Search Result")
    end

    it '"無電解ニッケルめっき"が表示されること' do
      get category_search_path, params: { search: 'めっき' }
      expect(response.body).to include("無電解ニッケルめっき")
    end
  end

  describe '#maker_search' do
    before do
      5.times do
        FactoryBot.create(:sample_list)
      end
    end

    it 'レスポンスが正常であること' do
      get maker_search_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get maker_search_path
      expect(response.body).to include("Search Result")
    end

    it '"無電解ニッケルめっき"が表示されること' do
      get maker_search_path, params: { keyword: '株式会社' }
      expect(response.body).to include("無電解ニッケルめっき")
    end
  end
end
