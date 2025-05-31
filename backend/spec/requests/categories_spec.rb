require 'rails_helper'

RSpec.describe "Categories API", type: :request do
  describe "#index" do
    before do
      @category = FactoryBot.create(:category)
    end

    it 'レスポンスのステータスがokであること' do
      get "/categories"
      expect(response).to have_http_status(:ok)
    end

    it 'カテゴリーリストが1件返ること' do
      get "/categories"
      json = JSON.parse(response.body)
      expect(json.count).to eq(1)
    end
  end

  describe '#show' do
    before do
      @category = FactoryBot.create(:category)
    end

    it 'レスポンスのステータスがokであること' do
      get "/categories/#{@category.id}"
      expect(response).to have_http_status(:ok)
    end

    it 'カテゴリー情報が返ること' do
      get "/categories/#{@category.id}"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json[:item]).to eq('めっき')
    end
  end


  describe '#create' do
    context '有効なカテゴリー情報で登録したとき' do
      before do
        @valid_category_params = { category: { item: 'コーティング',
                                               summary: '溶射金属やセラミックスなどの粉末を、溶解状態にして製品表面に吹き付ける処理のこと。' } }
      end

      it 'レスポンスのステータスがcreatedであること' do
        post "/categories", params: @valid_category_params
        expect(response).to have_http_status(:created)
      end

      it 'headerのlocationが登録したカテゴリーを参照していること' do
        post "/categories", params: @valid_category_params
        category = Category.last
        expect(response.header["Location"]).to eq("http://www.example.com/categories/#{category.id}")
      end

      it 'データベースのカテゴリー数が1増えること' do
        expect{ post "/categories", params: @valid_category_params }.to change{ Category.count }.from(0).to(1)
      end
    end

    context '無効なカテゴリー情報で登録したとき' do
      before do
        @invalid_category_params = { category: { item: "",
                                                 summary: '溶射金属やセラミックスなどの粉末を、溶解状態にして製品表面に吹き付ける処理のこと。' } }
      end

      it 'レスポンスのステータスがunprocessable_entityであること' do
        post "/categories", params: @invalid_category_params
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'データベースに登録されないこと' do
        expect{ post "/categories", params: @invalid_category_params }.to_not change{ Category.count }.from(0)
      end
    end
  end

  describe '#update' do
    before do
      @category = FactoryBot.create(:category)
    end

    context '有効なカテゴリー情報で更新したとき' do
      it 'レスポンスのステータスがokであること' do
        patch "/categories/#{@category.id}", params: { category: { item: 'sample category' } }
        expect(response).to have_http_status(:ok)
      end

      it 'itemがsample categoryで更新されること' do
        patch "/categories/#{@category.id}", params: { category: { item: 'sample category' } }
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:item]).to eq('sample category')
      end
    end

    context '無効なカテゴリー情報で更新したとき' do
      it 'レスポンスのステータスがunprocessable_entityであること' do
        patch "/categories/#{@category.id}", params: { category: { item: '' } }
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'カテゴリー名が空白で更新できないこと' do
        patch "/categories/#{@category.id}", params: { category: { item: '' } }
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:item]).to eq(["（カテゴリー名）が空白です。"])
      end
    end
  end

  describe '#destroy' do
    before do
      @category = FactoryBot.create(:category)
    end

    it 'レスポンスのステータスがno_contentであること' do
      delete "/categories/#{@category.id}"
      expect(response).to have_http_status(:no_content)
    end

    it 'カテゴリーの削除に成功すること' do
      expect { delete "/categories/#{@category.id}" }.to change{ Category.count }.from(1).to(0)
    end
  end
end
