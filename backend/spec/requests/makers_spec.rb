require 'rails_helper'

RSpec.describe "Makers API", type: :request do
  describe '#index' do
    before do
      FactoryBot.create_list(:maker_list, 9)
    end

    it 'レスポンスのステータスがsuccessであること' do
      get "/makers"
      expect(response).to have_http_status(:success)
    end

    it 'メーカーリストが9件返ること' do
      get "/makers"
      json = JSON.parse(response.body)
      expect(json.count).to eq(9)
    end
  end

  describe "#show" do
    before do
      @maker = FactoryBot.create(:maker)
    end

    it 'レスポンスのステータスがsuccessであること' do
      get "/makers/#{@maker.id}"
      expect(response).to have_http_status(:success)
    end

    it 'メーカー情報が返ること' do
      get "/makers/#{@maker.id}"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json[:name]).to eq('松本情報合名会社')
    end
  end

  describe '#create' do
    context '有効なメーカー情報で登録したとき' do
      before do
        @valid_maker_params = { maker: { name: '松本情報合名会社',
                                         postal_code: '859-1105',
                                         address: '東京都渋谷区神南1-2-3',
                                         phone_number: '075-4747-2450',
                                         fax_number: '075-4747-2451',
                                         email: 'sample_maker@example.com',
                                         home_page: 'https://example.com/',
                                         manufacturer_rep: '池田 彩花' } }
      end

      it 'レスポンスのステータスがcreatedであること' do
        post "/makers", params: @valid_maker_params
        expect(response).to have_http_status(:created)
      end

      it 'headerのlocationが登録したメーカーを参照していること' do
        post "/makers", params: @valid_maker_params
        maker = Maker.last
        expect(response.header["Location"]).to eq("http://www.example.com/makers/#{maker.id}")
      end

      it 'データベースのメーカー数が1増えること' do
        expect{ post "/makers", params: @valid_maker_params }.to change{ Maker.count }.from(0).to(1)
      end
    end

    context '無効なメーカー情報で登録したとき' do
      before do
        @invalid_maker_params = { maker: { name: '',
                                           postal_code: '859-1105',
                                           address: '東京都渋谷区神南1-2-3',
                                           phone_number: '075-4747-2450',
                                           fax_number: '075-4747-2451',
                                           email: 'sample_maker@example.com',
                                           home_page: 'https://example.com/',
                                           manufacturer_rep: '池田 彩花' } }
      end

      it 'レスポンスのステータスがunprocessable_entityであること' do
        post "/makers", params: @invalid_maker_params
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'データベースに登録されないこと' do
        expect{ post "/makers", params: @invalid_maker_params }.to_not change{ Maker.count }.from(0)
      end
    end
  end

  describe '#update' do
    before do
      @maker = FactoryBot.create(:maker)
    end

    context '有効なメーカー情報で更新したとき' do
      it 'nameがsample makerで更新されること' do
        patch "/makers/#{@maker.id}", params: { maker: { name: 'sample maker' } }
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:name]).to eq('sample maker')
      end
    end

    context '無効なメーカー情報で更新した場合' do
      it 'レスポンスのステータスがunprocessable_entityであること' do
        patch "/makers/#{@maker.id}", params: { maker: { name: '' } }
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'メーカー名が空白で更新できないこと' do
        patch "/makers/#{@maker.id}", params: { maker: { name: '' } }
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:name]).to eq(["（メーカー名）が空白です"])
      end
    end
  end

  describe '#destroy' do
    before do
      @maker = FactoryBot.create(:maker)
    end

    it 'メーカーの削除に成功すること' do
      expect { delete "/makers/#{@maker.id}" }.to change{ Maker.count }.from(1).to(0)
    end
  end
end
