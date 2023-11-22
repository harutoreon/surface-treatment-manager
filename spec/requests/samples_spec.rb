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
      expect(response.body).to include '<div role="navigation" aria-label="Pagination" class="pagination">'
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
      expect(response.body).to include "<a data-turbo-method=\"delete\" data-turbo-confirm=\"Are you sure?\" href=\"/samples/1\">"
      # expect(response.body).to include "Sample Destroy"
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
  end

  describe '#create' do
    let(:sample_params) { { sample: { name: "sample", category: "sample", color: "sample", maker: "sample" } } }

    it '登録が成功すること' do
      expect { post samples_path, params: sample_params }.to change(Sample, :count).by 1
    end

    it 'samples/showにリダイレクトされること' do
      post samples_path, params: sample_params
      sample = Sample.last
      expect(response).to redirect_to sample
    end

    it '登録が失敗すること' do
      expect { post samples_path, params: { sample: { name: '', category: 'sample', color: 'sampel', maker: 'sample' } } }.to_not change(Sample, :count)
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
      expect(response).to redirect_to root_path
    end
  end
end
