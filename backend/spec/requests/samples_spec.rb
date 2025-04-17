require 'rails_helper'

RSpec.describe "Samples API", type: :request do
  describe '#index' do
    before do
      FactoryBot.create_list(:sample_list, 10)
    end

    it 'レスポンスのステータスがsuccessであること' do
      get "/samples"
      expect(response).to have_http_status(:success)
    end

    it 'レスポンスにsamplesが含まれていること' do
      get "/samples"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json.include?(:samples)).to be(true)
      expect(json[:samples].count).to eq(8)
    end

    it 'レスポンスにcurrent_pageが含まれていること' do
      get "/samples"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json.include?(:current_page)).to be(true)
      expect(json[:current_page]).to eq(1)
    end

    it 'レスポンスにtotal_pagesが含まれていること' do
      get "/samples"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json.include?(:total_pages)).to be(true)  
      expect(json[:total_pages]).to eq(2)  
    end
  end

  describe "#show" do
    before do
      @sample = FactoryBot.create(:sample)
    end

    it 'レスポンスのステータスがsuccessであること' do
      get "/samples/#{@sample.id}"
      expect(response).to have_http_status(:success)
    end

    it '表面処理情報が返ること' do
      get "/samples/#{@sample.id}"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json[:name]).to eq("無電解ニッケルめっき")
    end
  end

  describe '#create' do
    context '有効な表面処理情報で登録したとき' do
      before do
        @valid_sample_params = { sample: { name: "銅めっき",
                                           category: "表面硬化",
                                           color: "マゼンタ",
                                           maker: "有限会社松本農林",
                                           picture: Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')),
                                           hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
                                           film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
                                           feature: '耐食性・耐摩耗性・耐薬品性・耐熱性' } }
      end

      it 'レスポンスのステータスがcreatedであること' do
        post "/samples", params: @valid_sample_params
        expect(response).to have_http_status(:created)
      end

      it 'headerのlocationが登録した表面処理を参照していること' do
        post "/samples", params: @valid_sample_params
        sample = Sample.last
        expect(response.header["Location"]).to eq("http://www.example.com/samples/#{sample.id}")
      end

      it 'データベースの表面処理数が1件増えること' do
        expect { post "/samples", params: @valid_sample_params }.to change{ Sample.count }.from(0).to(1)
      end
    end

    context '無効な表面処理情報で登録したとき' do
      before do
        @invalid_sample_params = { sample: { name: "",
                                             category: "表面硬化",
                                             color: "マゼンタ",
                                             maker: "有限会社松本農林",
                                             picture: Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')),
                                             hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
                                             film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
                                             feature: '耐食性・耐摩耗性・耐薬品性・耐熱性' } }
      end

      it 'レスポンスのステータスがunprocessable_entityであること' do
        post "/samples", params: @invalid_sample_params
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'データベースに登録されないこと' do
        expect { post "/samples", params: @invalid_sample_params }.to_not change{ Sample.count }.from(0)
      end
    end
  end

  describe '#update' do
    before do
      @sample = FactoryBot.create(:sample)
    end

    context '有効な表面処理情報で更新したとき' do
      it 'nameがハードクロムめっきで更新されること' do
        patch "/samples/#{@sample.id}", params: { sample: { name: "ハードクロムめっき" } }
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:name]).to eq("ハードクロムめっき")
      end
    end

    context '無効な表面処理情報で更新したとき' do
      it 'レスポンスがunprocessable_entityであること' do
        patch "/samples/#{@sample.id}", params: { sample: { name: '' } }
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it '表面処理名が空白で更新できないこと' do
        patch "/samples/#{@sample.id}", params: { sample: { name: '' } }
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:name]).to eq(["（処理名）が空白です。"])
      end
    end
  end

  describe '#destroy' do
    before do
      @sample = FactoryBot.create(:sample)
      @sample.comments.create(commenter: 'sample user', department: 'department', body: 'sample comment.')
    end

    it '表面処理の削除に成功すること' do
      expect { delete "/samples/#{@sample.id}" }.to change{ Sample.count }.from(1).to(0)
    end

    it '紐付いたコメントも削除されること' do
      expect { delete "/samples/#{@sample.id}" }.to change{ Comment.count }.from(1).to(0)
    end
  end
end
