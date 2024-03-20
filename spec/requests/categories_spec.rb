require 'rails_helper'

RSpec.describe "Categories", type: :request do
  before do
    admin = FactoryBot.create(:admin)
    log_in(admin)

    @category = FactoryBot.create(:category)
  end

  describe "#index" do
    it 'レスポンスが正常であること' do
      get categories_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get categories_path
      expect(response.body).to include('Category List')
    end

    it 'タイトルが表示されること' do
      get categories_path
      expect(response.body).to include('<title>Category List</title>')
    end
  end

  describe '#show' do
    it 'レスポンスが正常であること' do
      get category_path(@category)
      expect(response).to have_http_status(:success)
    end

    it '見出しが「Category Show」であること' do
      get category_path(@category)
      expect(response.body).to include('Category Show')
    end

    it 'タイトルが表示されること' do
      get category_path(@category)
      expect(response.body).to include('<title>Category Show</title>')
    end
  end

  describe '#new' do
    it 'レスポンスが正常であること' do
      get new_category_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが「Category New」であること' do
      get new_category_path
      expect(response.body).to include('Category New')
    end

    it 'タイトルが表示されること' do
      get new_category_path
      expect(response.body).to include('<title>Category New</title>')
    end
  end

  describe '#create' do
    let(:valid_params)   { { category: { item: "蒸着" } } }
    let(:invalid_params) { { category: { item: "" } } }

    context '有効なパラメータの場合' do
      it '登録が成功すること' do
        expect { post categories_path, params: valid_params }.to change{ Category.count }.from(1).to(2)
      end

      it 'categories#showにリダイレクトされること' do
        post categories_path, params: valid_params
        category = Category.last
        expect(response).to redirect_to(category)
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
      expect(response).to have_http_status(:success)
    end

    it '見出しが「Category Edit」であること' do
      get edit_category_path(@category)
      expect(response.body).to include('Category Edit')
    end

    it 'タイトルが表示されること' do
      get edit_category_path(@category)
      expect(response.body).to include('<title>Category Edit</title>')
    end
  end

  describe '#update' do
    context '有効なパラメータの場合' do
      it '更新が成功すること' do
        patch category_path(@category), params: { category: { item: '陽極酸化' } }
        @category.reload
        expect(@category.item).to eq('陽極酸化')
      end

      it 'categories#showにリダイレクトされること' do
        patch category_path(@category), params: { category: { item: '陽極酸化' } }
        @category.reload
        expect(response).to redirect_to(@category)
      end
    end

    context '無効なパラメータの場合' do
      it '更新が失敗すること' do
        patch category_path(@category), params: { category: { item: '' } }
        @category.reload
        expect(@category.item).to eq('溶射')
      end

      it 'categories#editに遷移されること' do
        patch category_path(@category), params: { category: { item: '' } }
        @category.reload
        expect(response.body).to include("Category Edit")
      end
    end
  end

  describe 'destroy' do
    it '削除できること' do
      expect { delete category_path(@category) }.to change{ Category.count }.from(1).to(0)
    end

    it 'categories#indexにリダイレクトされること' do
      delete category_path(@category)
      expect(response).to redirect_to(categories_url)
    end
  end
end
