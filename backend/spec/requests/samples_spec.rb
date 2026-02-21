require 'rails_helper'

RSpec.describe "Samples API", type: :request do
  describe '#index' do
    before do
      @maker = FactoryBot.create(:maker)
      FactoryBot.create(:category)
      FactoryBot.create_list(:sample_list, 10)
    end

    it 'レスポンスのステータスがokであること' do
      get "/makers/#{@maker.id}/samples"
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスにsamplesが含まれていること' do
      get "/makers/#{@maker.id}/samples"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json.include?(:samples)).to be(true)
      expect(json[:samples].count).to eq(7)
    end

    it 'レスポンスにcurrent_pageが含まれていること' do
      get "/makers/#{@maker.id}/samples"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json.include?(:current_page)).to be(true)
      expect(json[:current_page]).to eq(1)
    end

    it 'レスポンスにtotal_pagesが含まれていること' do
      get "/makers/#{@maker.id}/samples"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json.include?(:total_pages)).to be(true)  
      expect(json[:total_pages]).to eq(2)  
    end
  end

  describe "#show" do
    before do
      @maker = FactoryBot.create(:maker)
      FactoryBot.create(:category)
      @sample = FactoryBot.create(:sample)
    end

    after(:context) do
      FileUtils.rm_rf(ActiveStorage::Blob.service.root)
    end

    it 'レスポンスのステータスがokであること' do
      get "/makers/#{@maker.id}/samples/#{@sample.id}"
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスに主要な属性がすべて含まれていること' do
      get "/makers/#{@maker.id}/samples/#{@sample.id}"
      json = JSON.parse(response.body, symbolize_names: true)
      sample = Sample.last

      expect(json[:name]).to eq(sample.name)
      expect(json[:color]).to eq(sample.color)
      expect(json[:hardness]).to eq(sample.hardness)
      expect(json[:film_thickness]).to eq(sample.film_thickness)
      expect(json[:feature]).to eq(sample.feature)
      expect(json[:summary]).to eq(sample.summary)
      expect(json[:maker_id]).to eq(sample.maker_id)
      expect(json[:category_id]).to eq(sample.category_id)
      expect(json[:image_url]).to eq(sample.image_url)
    end

    context '画像が添付済の場合' do
      it 'image_url の戻り値が画像の URL であること' do
        get "/makers/#{@maker.id}/samples/#{@sample.id}"
        json = JSON.parse(response.body, symbolize_names: true)
  
        expect(json[:image_url]).to include('http://localhost:3000/rails/active_storage/blobs')
      end        
    end

    context '画像が未添付の場合' do
      it 'image_url の戻り値が nil であること' do
        @sample.image.purge

        get "/makers/#{@maker.id}/samples/#{@sample.id}"
        json = JSON.parse(response.body, symbolize_names: true)

        expect(json[:image_url]).to eq(nil)
      end      
    end
  end

  describe '#create' do
    context '有効な表面処理情報で登録したとき' do
      before do
        @maker = FactoryBot.create(:maker)
        category = FactoryBot.create(:category)
        @valid_sample_params = { sample: { name: "銅めっき",
                                           color: "マゼンタ",
                                           image: Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')),
                                           hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
                                           film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
                                           feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
                                           summary: '銅を電気めっきや化学めっきで表面に薄く被覆する技術です。',
                                           category_id: category.id } }
      end

      it 'レスポンスのステータスがcreatedであること' do
        post "/makers/#{@maker.id}/samples", params: @valid_sample_params
        expect(response).to have_http_status(:created)
      end

      it 'headerのlocationが登録した表面処理を参照していること' do
        post "/makers/#{@maker.id}/samples", params: @valid_sample_params
        sample = Sample.last
        expect(response.header["Location"]).to eq("http://www.example.com/makers/#{@maker.id}/samples/#{sample.id}")
      end

      it 'データベースの表面処理数が1件増えること' do
        expect { post "/makers/#{@maker.id}/samples", params: @valid_sample_params }.to change{ Sample.count }.from(0).to(1)
      end
    end

    context '無効な表面処理情報で登録したとき' do
      before do
        @maker = FactoryBot.create(:maker)
        category = FactoryBot.create(:category)
        @invalid_sample_params = { sample: { name: "",
                                             color: "マゼンタ",
                                             image: nil,
                                             hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
                                             film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
                                             feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
                                             summary: '銅を電気めっきや化学めっきで表面に薄く被覆する技術です。',
                                             category_id: category.id } }
      end

      it 'レスポンスのステータスがunprocessable_contentであること' do
        post "/makers/#{@maker.id}/samples", params: @invalid_sample_params
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'データベースに登録されないこと' do
        expect { post "/makers/#{@maker.id}/samples", params: @invalid_sample_params }.to_not change{ Sample.count }.from(0)
      end
    end
  end

  describe '#update' do
    before do
      @maker = FactoryBot.create(:maker)
      FactoryBot.create(:category)
      @sample = FactoryBot.create(:sample)
    end

    context '有効な表面処理情報で更新したとき' do
      it 'レスポンスのステータスがokであること' do
        patch "/makers/#{@maker.id}/samples/#{@sample.id}", params: { sample: { name: "ハードクロムめっき" } }
        expect(response).to have_http_status(:ok)
      end

      it 'nameがハードクロムめっきで更新されること' do
        patch "/makers/#{@maker.id}/samples/#{@sample.id}", params: { sample: { name: "ハードクロムめっき" } }
        json = JSON.parse(response.body, symbolize_names: true)

        expect(json[:name]).to eq("ハードクロムめっき")
      end
    end

    context '無効な表面処理情報で更新したとき' do
      it 'レスポンスがunprocessable_contentであること' do
        patch "/makers/#{@maker.id}/samples/#{@sample.id}", params: { sample: { name: '' } }
        expect(response).to have_http_status(:unprocessable_content)
      end

      it '表面処理名が空白で更新できないこと' do
        patch "/makers/#{@maker.id}/samples/#{@sample.id}", params: { sample: { name: '' } }
        json = JSON.parse(response.body, symbolize_names: true)

        expect(json[:name]).to eq(["（処理名）が空白です。"])
      end
    end
  end

  describe '#destroy' do
    before do
      @maker = FactoryBot.create(:maker)
      FactoryBot.create(:category)
      @sample = FactoryBot.create(:sample)
      user = FactoryBot.create(:user)
      @sample.comments.create(commenter: 'sample user', department: 'department', body: 'sample comment.', user_id: user.id)
    end

    it 'レスポンスのステータスがno_contentであること' do
      delete "/makers/#{@maker.id}/samples/#{@sample.id}"
      expect(response).to have_http_status(:no_content)
    end

    it 'レスポンスの本文が空であること' do
      delete "/makers/#{@maker.id}/samples/#{@sample.id}"
      expect(response.body).to be_blank
    end
    
    it '表面処理の削除に成功すること' do
      expect { delete "/makers/#{@maker.id}/samples/#{@sample.id}" }.to change{ Sample.count }.from(1).to(0)
    end

    it '紐付いたコメントも削除されること' do
      expect { delete "/makers/#{@maker.id}/samples/#{@sample.id}" }.to change{ Comment.count }.from(1).to(0)
    end
  end
  
  describe '#sample_list' do
    before do
      @maker = FactoryBot.create(:maker)
      FactoryBot.create(:category)
      FactoryBot.create_list(:sample_list, 10)      
    end

    it 'レスポンスのステータスがokであること' do
      get "/sample_list"
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスに10件のサンプルが含まれていること' do
      get "/sample_list"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json.count).to eq(10)
    end
  end

  describe '#sample_list_with_pagination' do
    before do
      @maker = FactoryBot.create(:maker)
      FactoryBot.create(:category)
      FactoryBot.create_list(:sample_list, 10)
    end

    it 'レスポンスのステータスがokであること' do
      get "/sample_list_with_pagination"
      expect(response).to have_http_status(:ok)
    end

    it 'jsonにsamples/current_page/total_pagesが含まれていること' do
      get "/sample_list_with_pagination"
      json = response.parsed_body
      expect(json['samples'].count).to eq(7)
      expect(json['current_page']).to eq(1)
      expect(json['total_pages']).to eq(2)
    end
  end

  describe 'sample_information' do
    before do
      FactoryBot.create(:maker)
      FactoryBot.create(:category)
      @sample = FactoryBot.create(:sample)
    end

    it 'レスポンスのステータスがokであること' do
      get "/samples/#{@sample.id}"
      expect(response).to have_http_status(:ok)
    end

    it 'jsonに主要な属性がすべて含まれていること' do
      get "/samples/#{@sample.id}"
      json = response.parsed_body
      sample = Sample.last

      expect(json['id']).to eq(sample.id)
      expect(json['name']).to eq(sample.name)
      expect(json['color']).to eq(sample.color)
      expect(json['hardness']).to eq(sample.hardness)
      expect(json['film_thickness']).to eq(sample.film_thickness)
      expect(json['feature']).to eq(sample.feature)
      expect(json['summary']).to eq(sample.summary)
      expect(json['maker_id']).to eq(sample.maker_id)
      expect(json['category_id']).to eq(sample.category_id)
      expect(json['image_url']).to eq(sample.image_url)
    end
  end
end
