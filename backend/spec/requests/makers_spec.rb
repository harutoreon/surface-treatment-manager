require 'rails_helper'

RSpec.describe "Makers API", type: :request do
  describe '#index' do
    let!(:maker) { FactoryBot.create(:maker) }

    it 'レスポンスのステータスがokであること' do
      get makers_path
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスにmakers/current_page/total_pagesが含まれていること' do
      get makers_path
      expect(response.parsed_body[:makers].size).to eq(1)
      expect(response.parsed_body[:current_page]).to eq(1)
      expect(response.parsed_body[:total_pages]).to eq(1)
    end
  end

  describe "#show" do
    let(:maker) { FactoryBot.create(:maker) }

    it 'レスポンスのステータスがokであること' do
      get maker_path(maker)
      expect(response).to have_http_status(:ok)
    end

    it 'メーカー情報が返ること' do
      get maker_path(maker)
      expect(response.parsed_body[:name]).to eq(maker.name)
      expect(response.parsed_body[:postal_code]).to eq(maker.postal_code)
      expect(response.parsed_body[:address]).to eq(maker.address)
      expect(response.parsed_body[:phone_number]).to eq(maker.phone_number)
      expect(response.parsed_body[:fax_number]).to eq(maker.fax_number)
      expect(response.parsed_body[:email]).to eq(maker.email)
      expect(response.parsed_body[:home_page]).to eq(maker.home_page)
      expect(response.parsed_body[:manufacturer_rep]).to eq(maker.manufacturer_rep)
    end
  end

  describe '#create' do
    let(:params) do
      { maker: { name: name,
                 postal_code: '859-1105',
                 address: '東京都渋谷区神南1-2-3',
                 phone_number: '075-4747-2450',
                 fax_number: '075-4747-2451',
                 email: 'sample_maker@example.com',
                 home_page: 'https://example.com/',
                 manufacturer_rep: '池田 彩花' } }
    end

    context '有効なメーカー情報で登録したとき' do
      let(:name) { '松本情報合名会社' }

      it 'レスポンスのステータスがcreatedであること' do
        post makers_path, params: params
        expect(response).to have_http_status(:created)
      end

      it 'データベースのレコードが増加し、headerにlocationが追加されること' do
        expect{ post makers_path, params: params }.to change{ Maker.count }.from(0).to(1)

        new_maker = Maker.last
        expect(response.header["Location"]).to eq(maker_url(new_maker))
      end
    end

    context '無効なメーカー情報で登録したとき' do
      let(:name) { '' }

      it 'レスポンスのステータスがunprocessable_contentであること' do
        post makers_path, params: params
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'データベースに登録されないこと' do
        expect{ post makers_path, params: params }.to_not change{ Maker.count }.from(0)
      end
    end
  end

  describe '#update' do
    let!(:maker) { FactoryBot.create(:maker) }

    context '有効なメーカー情報で更新したとき' do
      it 'レスポンスのステータスがokであること' do
        patch maker_path(maker), params: { maker: { name: 'sample maker' } }
        expect(response).to have_http_status(:ok)
      end

      it 'nameがsample makerで更新されること' do
        patch maker_path(maker), params: { maker: { name: 'sample maker' } }
        expect(maker.reload.name).to eq('sample maker')
      end
    end

    context '無効なメーカー情報で更新した場合' do
      it 'レスポンスのステータスがunprocessable_contentであること' do
        patch maker_path(maker), params: { maker: { name: '' } }
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'メーカー名が空白で更新できないこと' do
        patch maker_path(maker), params: { maker: { name: '' } }
        expect(maker.reload.name).to eq('松本情報合名会社')
        expect(response.parsed_body[:name]).to eq(["メーカー名が空白です"])
      end
    end
  end

  describe '#destroy' do
    let!(:maker) { FactoryBot.create(:maker) }

    it 'レスポンスのステータスがno_contentであること' do
      delete maker_path(maker)
      expect(response).to have_http_status(:no_content)
    end

    it 'メーカーの削除に成功し、レスポンスの本文は空であること' do
      expect { delete maker_path(maker) }.to change{ Maker.count }.from(1).to(0)
      expect(response.body).to be_blank
    end
  end

  describe '#maker_list' do
    let!(:maker) { FactoryBot.create(:maker) }

    it 'レスポンスのステータスがokであること' do
      get maker_list_path
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスのレコードに過不足なく属性が含まれていること' do
      get maker_list_path
      maker = Maker.first
      json = response.parsed_body.first
      expect(json.keys).to match_array(%w(id name))
      expect(json['id']).to eq(maker.id)
      expect(json['name']).to eq(maker.name)
    end
  end
end
