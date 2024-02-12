require 'rails_helper'

RSpec.describe "Samples", type: :request do
  before do
    user = FactoryBot.create(:user)
    log_in(user)

    @sample = FactoryBot.create(:sample)
  end

  describe '#index' do
    it 'レスポンスが正常であること' do
      get samples_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get samples_path
      expect(response.body).to include("Sample Index")
    end
  end

  describe "#show" do
    it 'レスポンスが正常であること' do
      get sample_path(@sample)
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get sample_path(@sample)
      expect(response.body).to include("Sample Show")
    end
  end

  describe '#new' do
    it 'レスポンスが正常であること' do
      get new_sample_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get new_sample_path
      expect(response.body).to include("Sample New")
    end
  end

  describe '#create' do
    let(:valid_params) { { sample: { name: "銅めっき",
                                     category: "表面硬化",
                                     color: "マゼンタ",
                                     maker: "有限会社松本農林",
                                     picture: Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) } } }

    let(:invalid_params) { { sample: { name: "",
                                       category: "表面硬化",
                                       color: "マゼンタ",
                                       maker: "有限会社松本農林",
                                       picture: Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) } } }

    context '有効なパラメータの場合' do
      it '登録が成功すること' do
        expect { post samples_path, params: valid_params }.to change{ Sample.count }.from(1).to(2)
      end

      it 'samples/showにリダイレクトされること' do
        post samples_path, params: valid_params
        sample = Sample.last
        expect(response).to redirect_to(sample)
      end
    end

    context '無効なパラメータの場合' do
      it '登録が失敗すること' do
        expect { post samples_path, params: invalid_params }.to_not change{ Sample.count }.from(1)
      end

      it 'samples/newが再描画されること' do
        post samples_path, params: invalid_params
        expect(response.body).to include("Sample New")
      end
    end
  end

  describe '#edit' do
    it 'レスポンスが正常であること' do
      get edit_sample_path(@sample)
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get edit_sample_path(@sample)
      expect(response.body).to include("Sample Edit")
    end
  end

  describe '#update' do
    context '有効なパラメータの場合' do
      it '更新が成功すること' do
        patch sample_path(@sample), params: { sample: { name: "ハードクロムめっき" } }
        @sample.reload
        expect(@sample.name).to eq("ハードクロムめっき")
      end

      it 'samples/showにリダイレクトされること' do
        patch sample_path(@sample), params: { sample: { name: "ハードクロムめっき" } }
        @sample.reload
        expect(response).to redirect_to(@sample)
      end
    end

    context '無効なパラメータの場合' do
      it '更新が失敗すること' do
        patch sample_path(@sample), params: { sample: { name: "" } }
        @sample.reload
        expect(@sample.name).to eq("無電解ニッケルめっき")
      end

      it 'samples/newが再描画されること' do
        patch sample_path(@sample), params: { sample: { name: "" } }
        expect(response.body).to include("Sample New")
      end
    end
  end

  describe '#destroy' do
    it '削除できること' do
      expect { delete sample_path(@sample) }.to change{ Sample.count }.from(1).to(0)
    end

    it 'static_pages/homeにリダイレクトされること' do
      delete sample_path(@sample)
      expect(response).to redirect_to(home_url)
    end
  end
end
