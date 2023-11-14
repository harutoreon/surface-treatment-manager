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
end
