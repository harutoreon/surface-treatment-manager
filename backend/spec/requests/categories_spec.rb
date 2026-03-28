require 'rails_helper'

RSpec.describe "Categories API", type: :request do
  describe "#index" do
    let!(:category) { FactoryBot.create(:category) }

    it 'レスポンスのステータスがokであること' do
      get categories_path
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスにレコードが1件含まれていること' do
      get categories_path
      expect(response.parsed_body.count).to eq(1)
    end
  end

  describe '#show' do
    let(:category) { FactoryBot.create(:category) }

    it 'レスポンスのステータスがokであること' do
      get category_path(category)
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスのレコードに過不足なく属性が含まれていること' do
      get category_path(category)
      json = response.parsed_body
      expect(json[:item]).to eq(category.item)
      expect(json[:summary]).to eq(category.summary)
    end
  end

  describe '#create' do
    let(:params) do
      { category: { item: item,
                    summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。' } }
    end

    context '有効な情報で登録したとき' do
      let(:item) { 'めっき' }

      it 'レスポンスのステータスがcreatedであること' do
        post categories_path, params: params
        expect(response).to have_http_status(:created)
      end

      it 'データベースのレコード数が増加し、headerにlocationが追加されること' do
        expect{
          post categories_path, params: params
        }.to change{ Category.count }.from(0).to(1)

        new_category = Category.last
        expect(response.header["Location"]).to eq(category_url(new_category))
      end
    end

    context '無効な情報で登録したとき' do
      let(:item) { '' }

      it 'レスポンスのステータスがunprocessable_contentであること' do
        post categories_path, params: params
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'データベースに登録されず、レスポンスに空白のエラーメッセージが含まれていること' do
        expect{
          post categories_path, params: params
        }.to_not change{ Category.count }.from(0)

        expect(response.parsed_body[:item]).to include('カテゴリー名が空白です')
      end
    end
  end

  describe '#update' do
    let!(:category) { FactoryBot.create(:category) }

    context '有効なカテゴリー名で更新したとき' do
      it 'レスポンスのステータスがokであること' do
        patch category_path(category), params: { category: { item: 'コーティング' } }
        expect(response).to have_http_status(:ok)
      end

      it 'カテゴリー名がコーティングで更新されること' do
        patch category_path(category), params: { category: { item: 'コーティング' } }
        expect(category.reload.item).to eq('コーティング')
      end
    end

    context '無効な情報で更新したとき' do
      it 'レスポンスのステータスがunprocessable_contentであること' do
        patch category_path(category), params: { category: { item: '' } }
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'itemが更新されず、レスポンスに空白のエラーメッセージが含まれていること' do
        patch category_path(category), params: { category: { item: '' } }
        expect(category.reload.item).to eq('めっき')
        expect(response.parsed_body[:item]).to include("カテゴリー名が空白です")
      end
    end
  end

  describe '#destroy' do
    let!(:category) { FactoryBot.create(:category) }

    it 'レスポンスのステータスがno_contentであること' do
      delete category_path(category)
      expect(response).to have_http_status(:no_content)
    end

    it 'カテゴリー情報の削除に成功し、レスポンスの本文は空であること' do
      expect {
        delete category_path(category)
      }.to change{ Category.count }.from(1).to(0)

      expect(response.body).to be_blank
    end
  end
end
