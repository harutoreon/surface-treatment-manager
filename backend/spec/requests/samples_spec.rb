require 'rails_helper'

RSpec.describe "Samples API", type: :request do
  describe '#index' do
    let!(:sample) { FactoryBot.create(:sample) }

    it 'レスポンスのステータスがokであること' do
      get maker_samples_path(sample.maker)
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスにsamples/current_page/total_pagesが含まれていること' do
      get maker_samples_path(sample.maker)
      json = response.parsed_body
      expect(json[:samples].size).to eq(1)
      expect(json[:current_page]).to eq(1)
      expect(json[:total_pages]).to eq(1)
    end
  end

  describe "#show" do
    let!(:sample) { FactoryBot.create(:sample) }

    after(:context) do
      FileUtils.rm_rf(ActiveStorage::Blob.service.root)
    end

    it 'レスポンスのステータスがokであること' do
      get maker_sample_path(sample.maker, sample)
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスに主要な属性がすべて含まれていること' do
      get maker_sample_path(sample.maker, sample)
      json = response.parsed_body
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
        get maker_sample_path(sample.maker, sample)
        expect(
          response.parsed_body[:image_url]
        ).to include('http://localhost:3000/rails/active_storage/blobs')
      end
    end

    context '画像が未添付の場合' do
      it 'image_url の戻り値が nil であること' do
        sample.image.purge

        get maker_sample_path(sample.maker, sample)
        expect(response.parsed_body[:image_url]).to eq(nil)
      end
    end
  end

  describe '#create' do
    let(:maker) { FactoryBot.create(:maker) }
    let(:category) { FactoryBot.create(:category) }
    let(:image) do
      Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg'))
    end
    let(:params) do
      { sample:
          { name: name,
            color: "マゼンタ",
            image: image,
            hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
            film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
            feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
            summary: '銅を電気めっきや化学めっきで表面に薄く被覆する技術です。',
            category_id: category.id } }
    end

    context '有効な表面処理情報で登録したとき' do
      let(:name) { '銅めっき' }

      it 'レスポンスのステータスがcreatedであること' do
        post maker_samples_path(maker), params: params
        expect(response).to have_http_status(:created)
      end

      it 'データベースの表面処理数が増加し、headerのlocationが追加されること' do
        expect {
          post maker_samples_path(maker), params: params
        }.to change{ Sample.count }.from(0).to(1)

        new_sample = Sample.last
        expect(
          response.header["Location"]
        ).to eq(maker_sample_url(new_sample.maker, new_sample))
      end
    end

    context '無効な表面処理情報で登録したとき' do
      let(:name) { '' }

      it 'レスポンスのステータスがunprocessable_contentであること' do
        post maker_samples_path(maker), params: params
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'データベースに登録されないこと' do
        expect {
          post maker_samples_path(maker), params: params
        }.to_not change{ Sample.count }.from(0)
      end
    end
  end

  describe '#update' do
    let!(:sample) { FactoryBot.create(:sample) }

    context '有効な表面処理情報で更新したとき' do
      it 'レスポンスのステータスがokであること' do
        patch maker_sample_path(sample.maker, sample),
          params: { sample: { name: "ハードクロムめっき" } }
        expect(response).to have_http_status(:ok)
      end

      it 'nameがハードクロムめっきで更新されること' do
        patch maker_sample_path(sample.maker, sample),
          params: { sample: { name: "ハードクロムめっき" } }
        expect(sample.reload.name).to eq("ハードクロムめっき")
      end
    end

    context '無効な表面処理情報で更新したとき' do
      it 'レスポンスがunprocessable_contentであること' do
        patch maker_sample_path(sample.maker, sample), params: { sample: { name: '' } }
        expect(response).to have_http_status(:unprocessable_content)
      end

      it '表面処理名が空白で更新できないこと' do
        patch maker_sample_path(sample.maker, sample), params: { sample: { name: '' } }
        expect(sample.reload.name).to eq('無電解ニッケルめっき')
        expect(response.parsed_body[:name]).to eq(["処理名が空白です"])
      end
    end
  end

  describe '#destroy' do
    let!(:sample) { FactoryBot.create(:sample) }

    it 'レスポンスのステータスがno_contentであること' do
      delete maker_sample_path(sample.maker, sample)
      expect(response).to have_http_status(:no_content)
    end

    it '表面処理の削除に成功し、レスポンスの本文は空であること' do
      expect{
        delete maker_sample_path(sample.maker, sample)
      }.to change{ Sample.count }.from(1).to(0)

      expect(response.body).to be_blank
    end
  end
  
  describe '#sample_list' do
    let!(:sample) { FactoryBot.create(:sample) }

    it 'レスポンスのステータスがokであること' do
      get sample_list_path
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスに1件のサンプルが含まれていること' do
      get sample_list_path
      expect(response.parsed_body.size).to eq(1)
    end
  end

  describe '#sample_list_with_pagination' do
    let!(:sample) { FactoryBot.create(:sample) }

    it 'レスポンスのステータスがokであること' do
      get sample_list_with_pagination_path
      expect(response).to have_http_status(:ok)
    end

    it 'jsonにsamples/current_page/total_pagesが含まれていること' do
      get sample_list_with_pagination_path
      json = response.parsed_body
      expect(json['samples'].size).to eq(1)
      expect(json['current_page']).to eq(1)
      expect(json['total_pages']).to eq(1)
    end
  end

  describe '#sample_information' do
    let!(:sample) { FactoryBot.create(:sample) }

    it 'レスポンスのステータスがokであること' do
      get sample_information_path(sample)
      expect(response).to have_http_status(:ok)
    end

    it 'jsonに主要な属性がすべて含まれていること' do
      get sample_information_path(sample)
      json = response.parsed_body
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
