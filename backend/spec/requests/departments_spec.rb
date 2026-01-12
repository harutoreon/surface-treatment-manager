require 'rails_helper'

RSpec.describe "Departments", type: :request do
  describe "#index" do
    before do
      FactoryBot.create(:department, name: '品質管理部')
      FactoryBot.create(:department, name: '製造部')
      FactoryBot.create(:department, name: '開発部')
      FactoryBot.create(:department, name: '営業部')
    end

    it "レスポンスのステータスがokであること" do
      get "/departments"
      expect(response).to have_http_status(:ok)
    end

    it '部署名が4件返ること' do
      get "/departments"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json.count).to eq(4)
    end

    it '部署名リストの並び順はidの昇順であること' do
      get "/departments"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json[0][:name]).to eq('品質管理部')
      expect(json[1][:name]).to eq('製造部')
      expect(json[2][:name]).to eq('開発部')
      expect(json[3][:name]).to eq('営業部')
    end
  end

  describe '#show' do
    before do
      @department = FactoryBot.create(:department)
    end

    it 'レスポンスのステータスがokであること' do
      get "/departments/#{@department.id}/"
      expect(response).to have_http_status(:ok)
    end

    it '部署名が返ること' do
      get "/departments/#{@department.id}/"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json[:name]).to eq('品質管理部')
    end
  end

  describe '#create' do
    context '有効な情報で登録したとき' do
      before do
        @valid_department_params = { department: { name: '品質保証部'} }
      end
      
      it 'レスポンスのステータスがcreatedであること' do
        post "/departments", params: @valid_department_params
        expect(response).to have_http_status(:created)
      end

      it 'headerのlocationが登録した部署名を参照していること' do
        post "/departments", params: @valid_department_params
        department = Department.last
        expect(response.header["Location"]).to eq("http://www.example.com/departments/#{department.id}")
      end

      it 'データベースのレコード数が1件増えること' do
        expect{ post "/departments", params: @valid_department_params }.to change{ Department.count }.from(0).to(1)
      end
    end

    context '無効な情報で登録したとき' do
      before do
        @invalid_department_params = { department: { name: ''} }
      end

      it 'レスポンスのステータスがunprocessable_contentであること' do
        post "/departments", params: @invalid_department_params
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'データベースに登録されないこと' do
        expect{ post "/departments", params: @invalid_department_params }.to_not change{ Department.count }.from(0)
      end

      it '部署名が空白のエラーメッセージが返ること' do
        post "/departments", params: @invalid_department_params
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:name][0]).to eq('部署名が空白です。')
      end
    end
  end

  describe '#update' do
    before do
      @department = FactoryBot.create(:department)      
    end
    
    context '有効な部署名で更新したとき' do
      it 'レスポンスのステータスがokであること' do
        patch "/departments/#{@department.id}", params: { department: { name: '営業部'} }
        expect(response).to have_http_status(:ok)
      end

      it 'nameが営業部で更新されること' do
        patch "/departments/#{@department.id}", params: { department: { name: '営業部'} }
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:name]).to eq('営業部')
      end
    end

    context '無効な情報で更新したとき' do
      it 'レスポンスのステータスがunprocessable_contentであること' do
        patch "/departments/#{@department.id}", params: { department: { name: ''} }
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'nameが更新されず元の品質管理部のままであること' do
        patch "/departments/#{@department.id}", params: { department: { name: ''} }
        department = Department.last
        expect(department.name).to eq('品質管理部')
      end

      it '部署名が空白のエラーメッセージが表示されること' do
        patch "/departments/#{@department.id}", params: { department: { name: ''} }
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:name][0]).to eq('部署名が空白です。')
      end
    end
  end


  describe '#destroy' do
    before do
      @department = FactoryBot.create(:department)      
    end

    it 'レスポンスのステータスがno_contentであること' do
      delete "/departments/#{@department.id}"
      expect(response).to have_http_status(:no_content)
    end

    it 'レスポンスの本文が空であること' do
      delete "/departments/#{@department.id}"
      expect(response.body).to be_blank
    end

    it '部署名の削除に成功すること' do
      expect { delete "/departments/#{@department.id}" }.to change{ Department.count }.from(1).to(0)
    end
  end
end
