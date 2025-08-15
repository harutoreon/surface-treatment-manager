require 'rails_helper'

RSpec.describe Sample, type: :model do
  describe 'Association' do
    describe 'has_one_attached' do
      it '画像を添付できること' do
        sample = FactoryBot.create(:sample)

        expect(sample.image).to be_attached
      end
    end
  end

  describe 'Validation' do
    before do
      @sample = FactoryBot.build(:sample)
    end

    it 'sampleが有効であること' do
      expect(@sample).to be_valid
    end

    it 'nameが存在すること' do
      @sample.name = ''
      expect(@sample).to_not be_valid
    end

    it 'categoryが存在すること' do
      @sample.category = ''
      expect(@sample).to_not be_valid
    end

    it 'colorが存在すること' do
      @sample.color = ''
      expect(@sample).to_not be_valid
    end

    it 'makerが存在すること' do
      @sample.maker = ''
      expect(@sample).to_not be_valid
    end

    it 'imageが存在すること' do
      @sample.image = nil
      expect(@sample).to_not be_valid
    end

    it 'hardnessが存在すること' do
      @sample.hardness = ''
      expect(@sample).to_not be_valid
    end

    it 'film_thicknessが存在すること' do
      @sample.film_thickness = ''
      expect(@sample).to_not be_valid
    end

    it 'featureが存在すること' do
      @sample.feature = ''
      expect(@sample).to_not be_valid
    end

    it 'summaryが存在すること' do
      @sample.summary = ''
      expect(@sample).to_not be_valid
    end

    it 'summaryの文字数が50文字以内であること' do
      @sample.summary = 's' * 51
      @sample.valid?
      expect(@sample).to_not be_valid
      expect(@sample.errors.messages[:summary].first).to eq('（概要）は50文字以内です。')
    end
  end

  describe 'Method return values' do
    describe '.name_search' do
      before do
        FactoryBot.create_list(:anodised_aluminium, 9)
        FactoryBot.create(:chromate)
      end
      
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

    describe '.category_search' do
      before do
        FactoryBot.create_list(:anodised_aluminium, 9)
        FactoryBot.create(:chromate)
      end

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

    describe '.maker_search' do
      before do
        FactoryBot.create_list(:anodised_aluminium, 9)
        FactoryBot.create(:chromate)
      end

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

    describe '#image_url' do
      context '画像が添付されている場合' do
        it '画像のURLを返すこと' do
          sample = FactoryBot.create(:sample)

          expect(sample.image_url).to be_present
          expect(sample.image_url).to include('test.jpg')
        end
      end

      context '画像が添付されていない場合' do
        it 'nilを返すこと' do
          sample = FactoryBot.create(:sample)
          sample.image.purge

          expect(sample.image_url).to be_nil
        end
      end
    end
  end
end
