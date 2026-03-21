require 'rails_helper'

RSpec.describe "Departments", type: :request do
  describe "#index" do
    let!(:department) { FactoryBot.create(:department) }

    it "レスポンスのステータスがokであること" do
      get departments_path
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスにレコードが1件含まれていること' do
      get departments_path
      expect(response.parsed_body.count).to eq(1)
    end
  end

  describe '#show' do
    let(:department) { FactoryBot.create(:department) }

    it 'レスポンスのステータスがokであること' do
      get department_path(department)
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスのレコードに過不足なく属性が含まれていること' do
      get department_path(department)
      json = response.parsed_body
      expect(json[:id]).to eq(department.id)
      expect(json[:name]).to eq(department.name)
    end
  end

  describe '#create' do
    let(:params) { { department: { name: name } } }

    context '有効な情報で登録したとき' do
      let(:name) { '品質保証部' }

      it 'レスポンスのステータスがcreatedであること' do
        post departments_path, params: params
        expect(response).to have_http_status(:created)
      end

      it 'データベースのレコード数が増加し、headerのlocationが新しい部署名を参照していること' do
        expect{
          post departments_path, params: params
        }.to change{ Department.count }.from(0).to(1)

        new_department = Department.last
        expect(response.header["Location"]).to eq(department_url(new_department))
      end
    end

    context '無効な情報で登録したとき' do
      let(:name) { '' }

      it 'レスポンスのステータスがunprocessable_contentであること' do
        post departments_path, params: params
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'データベースに登録されず、部署名が空白のエラーメッセージが返ること' do
        expect{
          post departments_path, params: params
        }.to_not change{ Department.count }.from(0)

        expect(response.parsed_body[:name]).to include('部署名が空白です')
      end
    end
  end

  describe '#update' do
    let!(:department) { FactoryBot.create(:department) }

    context '有効な部署名で更新したとき' do
      it 'レスポンスのステータスがokであること' do
        patch department_path(department), params: { department: { name: '営業部'} }
        expect(response).to have_http_status(:ok)
      end

      it 'nameが営業部で更新されること' do
        patch department_path(department), params: { department: { name: '営業部'} }
        expect(department.reload.name).to eq('営業部')
      end
    end

    context '無効な情報で更新したとき' do
      it 'レスポンスのステータスがunprocessable_contentであること' do
        patch department_path(department), params: { department: { name: ''} }
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'nameが更新されず、部署名が空白のエラーメッセージが返ること' do
        patch department_path(department), params: { department: { name: ''} }
        expect(department.reload.name).to eq('品質管理部')
        expect(response.parsed_body[:name]).to include('部署名が空白です')
      end
    end
  end


  describe '#destroy' do
    let!(:department) { FactoryBot.create(:department) }

    it 'レスポンスのステータスがno_contentであること' do
      delete department_path(department)
      expect(response).to have_http_status(:no_content)
    end

    it '部署名の削除に成功し、レスポンスの本文が空であること' do
      expect {
        delete department_path(department)
      }.to change{ Department.count }.from(1).to(0)

      expect(response.body).to be_blank
    end
  end
end
