require 'rails_helper'

RSpec.describe "Categories", type: :request do
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
    before do
      @category = FactoryBot.create(:category)
    end

    it 'レスポンスが正常であること' do
      get category_path(@category)
      expect(response).to have_http_status(:success)
    end
    it '見出しが表示されること' do
      get category_path(@category)
      expect(response.body).to include('Category Information')
    end
    it 'タイトルが表示されること' do
      get category_path(@category)
      expect(response.body).to include('<title>Category Information</title>')
    end
  end

  describe '#new' do
    it 'レスポンスが正常であること' do
      get new_category_path
      expect(response).to have_http_status(:success)
    end
    it '見出しが表示されること' do
      get new_category_path
      expect(response.body).to include('New Registration for Category')
    end
    it 'タイトルが表示されること' do
      get new_category_path
      expect(response.body).to include('<title>New Registration for Category</title>')
    end
  end

  describe '#create' do
    let(:valid_params)   { { category: { item: 'コーティング', summary: '溶射金属やセラミックスなどの粉末を、溶解状態にして製品表面に吹き付ける処理のこと。' } } }
    let(:invalid_params) { { category: { item: "", summary: '溶射金属やセラミックスなどの粉末を、溶解状態にして製品表面に吹き付ける処理のこと。' } } }

    context '有効なパラメータの場合' do
      it 'レコードが1件増加すること' do
        expect { post categories_path, params: valid_params }.to change{ Category.count }.from(0).to(1)
      end
      it 'categories#showにリダイレクトされること' do
        post categories_path, params: valid_params
        category = Category.last
        expect(response).to redirect_to(category)
      end
    end
    context '無効なパラメータの場合' do
      it 'レコード数が変わらないこと' do
        expect { post categories_path, params: invalid_params }.to_not change{ Category.count }.from(0)
      end
      it 'categories/newに遷移すること' do
        post categories_path, params: invalid_params
        expect(response.body).to include("New Registration for Category")
      end
    end
  end

  describe '#edit' do
    before do
      @category = FactoryBot.create(:category)
    end

    context 'ログイン済みの場合' do
      before do
        user = FactoryBot.create(:user)
        log_in(user)
      end

      it 'レスポンスが正常であること' do
        get edit_category_path(@category)
        expect(response).to have_http_status(:success)
      end
      it '見出しが「Category Edit」であること' do
        get edit_category_path(@category)
        expect(response.body).to include('Edit for Category')
      end
      it 'タイトルが表示されること' do
        get edit_category_path(@category)
        expect(response.body).to include('<title>Edit for Category</title>')
      end
    end
    context '未ログインの場合' do
      it "ログインページにリダイレクトされること" do
        get edit_category_path(@category)
        assert_redirected_to login_url
      end
      it 'フラッシュメッセージが表示されること' do
        get edit_category_path(@category)
        expect(flash[:danger]).to eq('Please log in.')
      end
    end
  end

  describe '#update' do
    before do
      @category = FactoryBot.create(:category)
    end

    context 'ログイン済みで' do
      before do
        user = FactoryBot.create(:user)
        log_in(user)
      end

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
          expect(@category.item).to eq('めっき')
        end
        it 'categories#editに遷移されること' do
          patch category_path(@category), params: { category: { item: '' } }
          @category.reload
          expect(response.body).to include("Edit for Category")
        end
      end
    end
    context '未ログインの場合' do
      it "ログインページにリダイレクトされること" do
        patch category_path(@category), params: { category: { item: '陽極酸化' } }
        assert_redirected_to login_url
      end
      it 'フラッシュメッセージが表示されること' do
        patch category_path(@category), params: { category: { item: '陽極酸化' } }
        expect(flash[:danger]).to eq('Please log in.')
      end
    end
  end

  describe '#destroy' do
    before do
      @category = FactoryBot.create(:category)
    end

    context 'ログイン済みの場合' do
      before do
        user = FactoryBot.create(:user)
        log_in(user)
      end

      it 'レコードが1件減少すること' do
        expect { delete category_path(@category) }.to change{ Category.count }.from(1).to(0)
      end
      it 'categories#indexにリダイレクトされること' do
        delete category_path(@category)
        expect(response).to redirect_to(categories_url)
      end
    end
    context '未ログインの場合' do
      it "ログインページにリダイレクトされること" do
        delete category_path(@category)
        assert_redirected_to login_url
      end
      it 'フラッシュメッセージが表示されること' do
        delete category_path(@category)
        expect(flash[:danger]).to eq('Please log in.')
      end
    end
  end
end
