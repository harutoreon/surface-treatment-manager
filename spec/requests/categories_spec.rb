require 'rails_helper'

RSpec.describe "Categories", type: :request do
  before do
    user = FactoryBot.create(:user)
    log_in(user)

    @category = FactoryBot.create(:category)
  end

  describe "#index" do
    it 'レスポンスが正常であること' do
      get categories_path
      expect(response).to have_http_status :success
    end
  end

  describe '#show' do
    it 'レスポンスが正常であること' do
      get category_path(@category)
      expect(response).to have_http_status :success
    end
  end

  describe '#new' do
    it 'レスポンスが正常であること' do
      get new_category_path
      expect(response).to have_http_status :success
    end
  end

  describe '#create' do
    let(:valid_params) { { category: { item: "蒸着" } } }
    let(:invalid_params) { { category: { item: "" } } }

    context '有効なパラメータの場合' do
      it '登録が完了すること' do
        expect { post categories_path, params: valid_params }.to change{ Category.count }.from(1).to(2)
      end
    end

    context '無効なパラメータの場合' do
      it '登録が失敗すること' do
        expect { post categories_path, params: invalid_params }.to_not change{ Category.count }.from(1)
      end

      it 'categories/newに遷移すること' do
        post categories_path, params: invalid_params
        expect(response.body).to include("Category New")
      end
    end
  end

  describe '#edit' do
    it 'レスポンスが正常であること' do
      get edit_category_path(@category)
      expect(response).to have_http_status :success
    end
  end

  describe '#update' do
    context '有効なパラメータの場合' do
      it '更新が成功すること' do
        patch category_path(@category), params: { category: { item: '陽極酸化' } }
        @category.reload
        expect(@category.item).to eq('陽極酸化')
      end
    end

    context '無効なパラメータの場合' do
      it '更新が失敗すること' do
        patch category_path(@category), params: { category: { item: '' } }
        @category.reload
        expect(@category.item).to eq('溶射')
      end
    end
  end
end
