require 'rails_helper'

RSpec.describe SamplesHelper, type: :helper do
  describe '#select_word' do
    before do
      words = ['めっき', '陽極酸化', '化成', 'コーティング', '表面硬化']
      words.each { |word| Category.create(item: word, summary: "#{word}の概要") }
    end

    it '「めっき」が含まれていること' do
      expect(select_word).to include('めっき')
    end
    it '「陽極酸化」が含まれていること' do
      expect(select_word).to include('陽極酸化')
    end
    it '「化成」が含まれていること' do
      expect(select_word).to include('化成')
    end
    it '「コーティング」が含まれていること' do
      expect(select_word).to include('コーティング')
    end
    it '「表面硬化」が含まれていること' do
      expect(select_word).to include('表面硬化')
    end
  end
end
