require 'rails_helper'

RSpec.describe "Categories", type: :request do
  describe "GET /index" do
    # pending "add some examples (or delete) #{__FILE__}"
  end

  describe '#new' do
    it 'レスポンスが正常であること' do
      get new_category_path
      expect(response).to have_http_status :success
    end
  end
end
