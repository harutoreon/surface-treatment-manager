require 'rails_helper'

RSpec.describe "StaticPages", type: :request do
  describe "#home" do
    it "レスポンスが正常であること" do
      get root_path
      expect(response).to have_http_status(:success)
    end
  end

  describe '#name' do
    it 'レスポンスが正常であること' do
      get name_path
      expect(response).to have_http_status(:success)
    end
  end

  describe '#category' do
    it 'レスポンスが正常であること' do
      get category_path
      expect(response).to have_http_status(:success)
    end
  end

  describe '#maker' do
    it 'レスポンスが正常であること' do
      get maker_path
      expect(response).to have_http_status(:success)
    end
  end
end
