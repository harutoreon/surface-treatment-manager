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
end
