require 'rails_helper'

RSpec.describe SamplesHelper, type: :helper do
  describe '#select_word' do
    before do
      Category.create([
        { item: 'めっき', summary: 'めっきの概要' },
        { item: '陽極酸化', summary: '陽極酸化の概要' },
        { item: '化成', summary: '化成の概要' },
        { item: 'コーティング', summary: 'コーティングの概要' },
        { item: '表面硬化', summary: '表面硬化の概要' }
      ])
    end

    it '登録されたカテゴリが過不足なく返ること' do
      expect(helper.select_word).to contain_exactly('めっき', '陽極酸化', '化成', 'コーティング', '表面硬化')
    end
  end
end
