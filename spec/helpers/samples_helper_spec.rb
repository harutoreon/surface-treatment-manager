require 'rails_helper'

RSpec.describe SamplesHelper, type: :helper do
  describe '#select_word' do
    before do
      words = ['めっき', '陽極酸化', '化成', 'コーティング', '表面硬化']
      words.each do |word|
        Category.create(item: word)
      end
    end

    it '1番目のカテゴリが「めっき」であること' do
      expect(select_word.index('めっき')).to eq(0)
    end

    it '2番目ののカテゴリが「陽極酸化」であること' do
      expect(select_word.index('陽極酸化')).to eq(1)
    end

    it '3番目のカテゴリが「化成」であること' do
      expect(select_word.index('化成')).to eq(2)
    end

    it '4番目のカテゴリが「コーティング」であること' do
      expect(select_word.index('コーティング')).to eq(3)
    end

    it '5番目のカテゴリが「表面硬化」であること' do
      expect(select_word.index('表面硬化')).to eq(4)
    end
  end
end
