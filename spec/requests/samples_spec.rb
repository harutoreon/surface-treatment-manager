require 'rails_helper'

RSpec.describe "Samples", type: :request do
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
  end
end
