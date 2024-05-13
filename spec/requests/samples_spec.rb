require 'rails_helper'

RSpec.describe "Samples", type: :request do
  before do
    # user = FactoryBot.create(:user)
    # log_in(user)

    @sample = FactoryBot.create(:sample)
  end

  describe '#index' do
    it 'レスポンスが正常であること' do
      get samples_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get samples_path
      expect(response.body).to include("Surface Treatment List")
    end

    it 'タイトルが表示されること' do
      get samples_path
      expect(response.body).to include('<title>Surface Treatment List</title>')
    end
  end

  describe "#show" do
    it 'レスポンスが正常であること' do
      get sample_path(@sample)
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get sample_path(@sample)
      expect(response.body).to include("Surface Treatment Information")
    end

    it 'タイトルが表示されること' do
      get sample_path(@sample)
      expect(response.body).to include('<title>Surface Treatment Information</title>')
    end
  end

  describe '#new' do
    it 'レスポンスが正常であること' do
      get new_sample_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get new_sample_path
      expect(response.body).to include("New Registration for Surface Treatment")
    end

    it 'タイトルが表示されること' do
      get new_sample_path
      expect(response.body).to include('<title>New Registration for Surface Treatment</title>')
    end

  end

  describe '#create' do
    let(:valid_params) { { sample: { name: "銅めっき",
                                     category: "表面硬化",
                                     color: "マゼンタ",
                                     maker: "有限会社松本農林",
                                     picture: Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')),
                                     hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
                                     film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
                                     feature: '耐食性・耐摩耗性・耐薬品性・耐熱性' } } }

    let(:invalid_params) { { sample: { name: "",
                                       category: "表面硬化",
                                       color: "マゼンタ",
                                       maker: "有限会社松本農林",
                                       picture: Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')),
                                       hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
                                       film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
                                       feature: '耐食性・耐摩耗性・耐薬品性・耐熱性' } } }

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
        expect(response.body).to include("New Registration for Surface Treatment")
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
      expect(response.body).to include("Edit for Surface Treatment")
    end

    it 'タイトルが表示されること' do
      get edit_sample_path(@sample)
      expect(response.body).to include('<title>Edit for Surface Treatment</title>')
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

      it 'samples/editが再描画されること' do
        patch sample_path(@sample), params: { sample: { name: "" } }
        expect(response.body).to include("Edit for Surface Treatment")
      end
    end
  end

  describe '#destroy' do
    before do
      @sample.comments.create(commenter: 'sample user', body: 'sample comment.')
    end

    it '削除できること' do
      expect { delete sample_path(@sample) }.to change{ Sample.count }.from(1).to(0)
    end

    it '紐付いたコメントも削除されること' do
      expect { delete sample_path(@sample) }.to change{ Comment.count }.from(1).to(0)
    end

    it 'samples/indexにリダイレクトされること' do
      delete sample_path(@sample)
      expect(response).to redirect_to(samples_url)
    end
  end
end
