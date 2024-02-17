require 'rails_helper'

RSpec.describe "Categories", type: :request do
  before do
    user = FactoryBot.create(:user)
    log_in(user)

    @sample = FactoryBot.create(:sample)
  end

  describe "GET /index" do
    # pending "add some examples (or delete) #{__FILE__}"
  end

  describe '#new' do
    it 'レスポンスが正常であること' do
      get new_category_path
      expect(response).to have_http_status :success
    end
  end

  describe '#create' do
    let(:valid_params) { { category: { item: "溶射" } } }
    let(:invalid_params) { { category: { item: "" } } }

    context '有効なパラメータの場合' do
      it '登録が完了すること' do
        expect { post categories_path, params: valid_params }.to change{ Category.count }.from(0).to(1)
      end
    end

    context '無効なパラメータの場合' do
      it '登録が失敗すること' do
        expect { post categories_path, params: invalid_params }.to_not change{ Category.count }.from(0)
      end

      it 'categories/newに遷移すること' do
        post categories_path, params: invalid_params
        expect(response.body).to include("Category New")
      end
    end
  end
end
