require 'rails_helper'

RSpec.describe Sample, type: :model do
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

  describe 'scope' do
    describe '#search' do
      before do
        5.times do
          FactoryBot.create(:sample_list)
        end
      end

      context '完全一致検索したとき' do
        it '対象のレコードが存在しないこと' do
          expect(Sample.search('perfect', 'めっき').count).to eq 0
        end
      end
      context '前方一致検索したとき' do
        it '対象のレコードが存在しないこと' do
          expect(Sample.search('forward', 'めっき').count).to eq 0
        end
      end
      context '後方一致検索したとき' do
        it '対象のレコードが5件存在すること' do
          expect(Sample.search('backward', 'めっき').count).to eq 5
        end
      end
      context '曖昧検索したとき' do
        it '対象のレコードが5件存在すること' do
          expect(Sample.search('partial', 'めっき').count).to eq 5
        end
      end
    end

    describe '#name_search' do
      before do
        9.times do
          FactoryBot.create(:valid_search_sample)
        end

        FactoryBot.create(:invalid_search_sample)
      end

      it '引数が「アルマイト」のときは、サンプルが9件返ること' do
        expect(Sample.name_search('アルマイト').count).to eq(9)
      end

      it '引数が「ブラスト」の時は、空の配列が返ること' do
        expect(Sample.name_search('ブラスト')).to eq([])
      end
    end

    describe '#category_search' do
      before do
        9.times do
          FactoryBot.create(:valid_search_sample)
        end

        FactoryBot.create(:invalid_search_sample)
      end

      it '引数が「陽極酸化」のときは、サンプルが9件返ること' do
        expect(Sample.category_search('陽極酸化').count).to eq(9)
      end

      it '引数が「表面硬化」のときは、空の配列が返ること' do
        expect(Sample.category_search('表面硬化')).to eq([])
      end
    end

    describe '#maker_search' do
      before do
        9.times do
          FactoryBot.create(:valid_search_sample)
        end

        FactoryBot.create(:invalid_search_sample)
      end

      it '引数が「有限会社」のときは、サンプルが9件返ること' do
        expect(Sample.maker_search('有限会社').count).to eq(9)
      end

      it '引数が「合同会社」のときは、空の配列が返ること' do
        expect(Sample.maker_search('合同会社')).to eq([])
      end
    end
  end
end
