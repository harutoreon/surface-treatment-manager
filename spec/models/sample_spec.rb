require 'rails_helper'

RSpec.describe Sample, type: :model do
  describe 'validation' do
    let(:sample) { FactoryBot.create(:sample) }

    it 'sampleが有効であること' do
      expect(sample).to be_valid
    end

    it 'nameが存在すること' do
      sample.name = ''
      expect(sample).to_not be_valid
    end

    it 'categoryが存在すること' do
      sample.category = ''
      expect(sample).to_not be_valid
    end

    it 'colorが存在すること' do
      sample.color = ''
      expect(sample).to_not be_valid
    end

    it 'makerが存在すること' do
      sample.maker = ''
      expect(sample).to_not be_valid
    end

    it 'pictureが存在すること' do
      sample.picture = ''
      expect(sample).to_not be_valid
    end
  end

  describe 'scope' do
    before do
      9.times do
        FactoryBot.create(:anodised_aluminium)
      end

      FactoryBot.create(:chromate)
    end

    describe '#name_search' do
      context '引数が「アルマイト」の場合' do
        it 'サンプルが9件返ること' do
          expect(Sample.name_search('アルマイト').count).to eq(9)
        end
      end

      context '引数が「クロメート」の場合' do
        it 'サンプルが1件返ること' do
          expect(Sample.name_search('クロメート').count).to eq(1)
        end
      end

      context '引数が「ブラスト」の場合' do
        it '空の配列が返ること' do
          expect(Sample.name_search('ブラスト')).to eq([])
        end
      end
    end

    describe '#category_search' do
      context '引数が「陽極酸化」の場合' do
        it 'サンプルが9件返ること' do
          expect(Sample.category_search('陽極酸化').count).to eq(9)
        end
      end

      context '引数が「化成」の場合' do
        it 'サンプルが1件返ること' do
          expect(Sample.category_search('化成').count).to eq(1)
        end
      end

      context '引数が「表面硬化」の場合' do
        it '空の配列が返ること' do
          expect(Sample.category_search('表面硬化')).to eq([])
        end
      end
    end

    describe '#maker_search' do
      context '引数が「有限会社」の場合' do
        it 'サンプルが9件返ること' do
          expect(Sample.maker_search('有限会社').count).to eq(9)
        end
      end

      context '引数が「株式会社」の場合' do
        it 'サンプルが1件返ること' do
          expect(Sample.maker_search('株式会社').count).to eq(1)
        end
      end

      context '引数が「合同会社」の場合' do
        it '空の配列が返ること' do
          expect(Sample.maker_search('合同会社')).to eq([])
        end
      end
    end
  end
end
