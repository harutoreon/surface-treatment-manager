require 'rails_helper'

RSpec.describe "Makers", type: :request do
  describe 'index' do
    it 'レスポンスが正常であること' do
      get makers_path
      expect(response).to have_http_status(:success)
    end

    it 'タイトルが表示されること' do
      get makers_path
      expect(response.body).to include('<title>Maker List</title>')
    end
  end

  describe "show" do
    before do
      @maker = FactoryBot.create(:maker)
    end

    it 'レスポンスが正常であること' do
      get maker_path(@maker)
      expect(response).to have_http_status(:success)
    end

    it 'タイトルが表示されること' do
      get maker_path(@maker)
      expect(response.body).to include('<title>Maker Information</title>')
    end
  end

  describe 'new' do
    it 'レスポンスが正常であること' do
      get new_maker_path
      expect(response).to have_http_status(:success)
    end

    it 'タイトルが表示されること' do
      get new_maker_path
      expect(response.body).to include('<title>New Registration for Maker</title>')
    end
  end

  describe 'create' do
    context '有効なパラメータの場合' do
      let(:valid_params) { { maker: { name: '松本情報合名会社',
                                      postal_code: '859-1105',
                                      address: '東京都渋谷区神南1-2-3',
                                      phone_number: '075-4747-2450',
                                      fax_number: '075-4747-2451',
                                      email: 'sample_maker@example.com',
                                      home_page: 'https://example.com/',
                                      manufacturer_rep: '池田 彩花' } } }

      it '登録が成功すること' do
        expect { post makers_path, params: valid_params }.to change{ Maker.count }.from(0).to(1)
      end

      it 'makers/showにリダイレクトすること' do
        post makers_path, params: valid_params
        maker = Maker.last
        expect(response).to redirect_to(maker)
      end
    end

    context '無効なパラメータの場合' do
      let(:invalid_params) { { maker: { name: '',
                                        postal_code: '859-1105',
                                        address: '東京都渋谷区神南1-2-3',
                                        phone_number: '075-4747-2450',
                                        fax_number: '075-4747-2451',
                                        email: 'sample_maker@example.com',
                                        home_page: 'https://example.com/',
                                        manufacturer_rep: '池田 彩花' } } }

      it '登録が失敗すること' do
        expect { post makers_path, params: invalid_params }.to_not change{ Maker.count }.from(0)
      end

      it 'makers/newが再描画されること' do
        post makers_path, params: invalid_params
        expect(response.body).to include("<title>New Registration for Maker</title>")
      end
    end
  end

  describe 'edit' do
    before do
      @maker = FactoryBot.create(:maker)
    end

    it 'レスポンスが正常であること' do
      get edit_maker_path(@maker)
      expect(response).to have_http_status(:success)
    end

    it 'タイトルが表示されること' do
      get edit_maker_path(@maker)
      expect(response.body).to include('<title>Edit for Maker</title>')
    end
  end

  describe 'update' do
    before do
      @maker = FactoryBot.create(:maker)
    end

    context '有効なパラメータの場合' do
      it '更新が成功すること' do
        patch maker_path(@maker), params: { maker: { name: '佐藤情報合名会社' } }
        @maker.reload
        expect(@maker.name).to eq('佐藤情報合名会社')
      end

      it 'makers/showにリダイレクトすること' do
        patch maker_path(@maker), params: { maker: { name: "佐藤情報合名会社" } }
        @maker.reload
        expect(response).to redirect_to(@maker)
      end
    end
  end

  describe 'destroy' do
    before do
      @maker = FactoryBot.create(:maker)
    end

    it '削除できること' do
      expect { delete maker_path(@maker) }.to change{ Maker.count }.from(1).to(0)
    end

    it 'makers/indexにリダイレクトすること' do
      delete maker_path(@maker)
      expect(response).to redirect_to(makers_url)
    end
  end
end