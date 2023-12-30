require 'rails_helper'

RSpec.describe "Samples", type: :request do
  describe '#index' do
    before do
      31.times do
        FactoryBot.create(:sample_list)
      end
    end

    it 'レスポンスが正常であること' do
      get samples_path
      expect(response).to have_http_status :ok
    end

    it '見出しが表示されること' do
      get samples_path
      expect(response.body).to include "Sample Index"
    end

    it 'div.pagenationが存在すること' do
      get samples_path
      expect(response.body).to include '<div role="navigation" aria-label="Pagination" class="justify-content-center">'
    end

    it 'サンプルごとのリンクが存在すること' do
      get samples_path
      Sample.paginate(page: 1).each do |sample|
        expect(response.body).to include "<a href=\"#{sample_path(sample)}\">"
      end
    end

    it 'samples/newのリンクが存在すること' do
      get samples_path
      expect(response.body).to include "<a href=\"#{new_sample_path}\">"
    end

    it 'headerが表示されること' do
      get samples_path
      expect(response.body).to include "<a class=\"navbar-brand fs-3\" href=\"#{samples_path}\">Surface Treatment Manager</a>"
    end
  end

  describe "#show" do
    let(:sample) { FactoryBot.create(:sample) }

    it 'レスポンスが正常であること' do
      get sample_path(sample)
      expect(response).to have_http_status :ok
    end

    it '見出しが表示されること' do
      get sample_path(sample)
      expect(response.body).to include "Sample Show"
    end

    it 'samples/editのリンクが存在すること' do
      get sample_path(sample)
      expect(response.body).to include "<a href=\"#{edit_sample_path(sample)}\">"
    end

    it 'samples/destroyのリンクが存在すること' do
      get sample_path(sample)
      sample_id = sample.id
      expect(response.body).to include "<a data-turbo-method=\"delete\" data-turbo-confirm=\"Are you sure?\" href=\"/samples/#{sample_id}\">"
    end

    it 'samples/indexのリンクが存在すること' do
      get sample_path(sample)
      expect(response.body).to include "<a href=\"#{samples_path}\">"
    end

    it 'headerが表示されること' do
      get sample_path(sample)
      expect(response.body).to include "<a class=\"navbar-brand fs-3\" href=\"#{samples_path}\">Surface Treatment Manager</a>"
    end

    it 'img要素が存在すること' do
      get sample_path(sample)
      expect(response.body).to include "<img src=\"/uploads_test/sample/picture/#{sample.id}/test.jpg\" />"
    end
  end

  describe '#new' do
    it 'レスポンスが正常であること' do
      get new_sample_path
      expect(response).to have_http_status :ok
    end

    it '見出しが表示されること' do
      get new_sample_path
      expect(response.body).to include "Sample New"
    end

    it 'samples/indexのリンクが存在すること' do
      get new_sample_path
      expect(response.body).to include "<a href=\"#{samples_path}\">"
    end

    it 'headerが表示されること' do
      get new_sample_path
      expect(response.body).to include "<a class=\"navbar-brand fs-3\" href=\"#{samples_path}\">Surface Treatment Manager</a>"
    end

    it 'ファイル選択用のinput要素が存在すること' do
      get new_sample_path
      expect(response.body).to include "type=\"file\""
    end
  end

  describe '#create' do
    let(:sample_params) { { sample: { name: "銅めっき",
                                      category: "表面硬化",
                                      color: "マゼンタ",
                                      maker: "有限会社松本農林",
                                      picture: Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) } } }

    it '登録が成功すること' do
      expect { post samples_path, params: sample_params }.to change(Sample, :count).by 1
    end

    it 'samples/showにリダイレクトされること' do
      post samples_path, params: sample_params
      sample = Sample.last
      expect(response).to redirect_to sample
    end

    it '登録が失敗すること' do
      expect { post samples_path, params: { sample: { name: '',
                                                      category: 'sample',
                                                      color: 'sampel',
                                                      maker: 'sample',
                                                      picture: Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')) } } }.to_not change(Sample, :count)
    end
  end

  describe '#edit' do
    let(:sample) { FactoryBot.create(:sample) }

    it 'レスポンスが正常であること' do
      get edit_sample_path(sample)
      expect(response).to have_http_status :ok
    end

    it '見出しが表示されること' do
      get edit_sample_path(sample)
      expect(response.body).to include "Sample Edit"
    end

    it 'samples/showのリンクが存在するか' do
      get edit_sample_path(sample)
      expect(response.body).to include "<a href=\"#{sample_path(sample)}\">"
    end

    it 'headerが表示されること' do
      get edit_sample_path(sample)
      expect(response.body).to include "<a class=\"navbar-brand fs-3\" href=\"#{samples_path}\">Surface Treatment Manager</a>"
    end
  end

  describe '#update' do
    let(:sample) { FactoryBot.create(:sample) }

    it '更新が成功すること' do
      patch sample_path(sample), params: { sample: { name: "ハードクロムめっき" } }
      sample.reload
      expect(sample.name).to eq "ハードクロムめっき"
    end

    it 'samples/showにリダイレクトされること' do
      patch sample_path(sample), params: { sample: { name: "ハードクロムめっき" } }
      sample.reload
      expect(response).to redirect_to sample
    end

    it '更新が失敗すること' do
      patch sample_path(sample), params: { sample: { name: "" } }
      sample.reload
      expect(sample.name).to eq "無電解ニッケルめっき"
    end
  end

  describe '#destroy' do
    let(:sample) { FactoryBot.create(:sample) }

    it '削除できること' do
      expect {
        delete sample_path(sample)
      }.to change(Sample, :count).by 0
    end

    it 'static_pages#homeにリダイレクトされること' do
      delete sample_path(sample)
      expect(response).to redirect_to samples_path
    end
  end
end
