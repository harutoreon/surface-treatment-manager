require 'rails_helper'

RSpec.describe Sample, type: :model do
  describe 'バリデーション' do
    let(:sample) { FactoryBot.build(:sample) }

    describe '有効性の検証' do
      it 'オブジェクトが有効であること' do
        expect(sample).to be_valid
      end
    end

    describe '存在性の検証' do
      it 'nameが空文字だと無効であること' do
        sample.name = ''
        sample.valid?
        expect(sample.errors.details[:name]).to include(error: :blank)
      end

      it 'colorが空文字だと無効であること' do
        sample.color = ''
        sample.valid?
        expect(sample.errors.details[:color]).to include(error: :blank)
      end

      it 'imageが未添付だと無効であること' do
        sample.image = nil
        sample.valid?
        expect(sample).to be_invalid
      end

      it 'hardnessが存在すること' do
        sample.hardness = ''
        sample.valid?
        expect(sample.errors.details[:hardness]).to include(error: :blank)
      end

      it 'film_thicknessが存在すること' do
        sample.film_thickness = ''
        sample.valid?
        expect(sample.errors.details[:film_thickness]).to include(error: :blank)
      end

      it 'featureが存在すること' do
        sample.feature = ''
        sample.valid?
        expect(sample.errors.details[:feature]).to include(error: :blank)
      end

      it 'summaryが存在すること' do
        sample.summary = ''
        sample.valid?
        expect(sample.errors.details[:summary]).to include(error: :blank)
      end
    end

    describe '長さの検証' do
      context 'summaryの文字数が50文字以内の場合' do
        it '有効であること' do
          sample.summary = 's' * 50
          sample.valid?
          expect(sample).to be_valid
        end
      end

      context 'summaryの文字数が50文字を超える場合' do
        it '無効であること' do
          sample.summary = 's' * 51
          sample.valid?
          expect(sample.errors.details[:summary]).to include(count: 50, error: :too_long)
        end
      end
    end
  end

  describe 'モデルメソッド' do
    let!(:sample) { FactoryBot.create(:sample) }

    describe '#image_url' do
      context '画像が添付されている場合' do
        it '画像のURLを返すこと' do
          expect(sample.image_url).to be_present
          expect(sample.image_url).to include('test.jpg')
        end
      end

      context '画像が添付されていない場合' do
        it 'nilを返すこと' do
          sample.image.purge
          expect(sample.image_url).to be_nil
        end
      end
    end

    describe '.with_image_url' do
      it 'id/name/summary/image_urlの属性が含まれていること' do
        samples = Sample.with_image_url
        json = samples.last

        expect(json.keys).to match_array(%w(id name summary image_url))
        expect(json['id']).to eq(sample.id)
        expect(json['name']).to eq(sample.name)
        expect(json['summary']).to eq(sample.summary)
        expect(json['image_url']).to eq(sample.image_url)
        expect(json['image_url']).to include("/rails/active_storage/blobs/")
      end
    end
  end

  describe 'スコープ' do
    let!(:sample) { FactoryBot.create(:sample) }

    describe '.name_search' do
      context '有効なキーワードの場合' do
        it 'サンプルが1件返ること' do
          expect(Sample.name_search('めっき').count).to eq(1)
        end
      end

      context '無効なキーワードの場合' do
        it '空の配列が返ること' do
          expect(Sample.name_search('ブラスト')).to eq([])
        end
      end
    end
  end
end
