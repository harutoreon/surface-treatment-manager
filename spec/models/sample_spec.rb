require 'rails_helper'

RSpec.describe Sample, type: :model do # rubocop:disable Metrics/BlockLength
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
  end
end
