require 'rails_helper'

RSpec.describe StaticPagesHelper, type: :helper do
  describe '#sample_exists?' do
    context 'レコードが存在する場合' do
      before do
        FactoryBot.create(:sample)
      end

      it 'trueが返ること' do
        expect(sample_exists?).to eq(true)
      end
    end

    context 'レコードが存在しない場合' do
      before do
        Sample.destroy_all
      end

      it 'falseが返ること' do
        expect(sample_exists?).to eq(false)
      end
    end
  end
end
