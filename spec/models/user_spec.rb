require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { FactoryBot.create(:user) }

  describe 'validation' do
    it 'userが有効であること' do
      expect(user).to be_valid
    end

    it 'nameが存在すること' do
      user.name = ' '
      expect(user).to_not be_valid
    end

    it 'nameは50文字以下であること' do
      user.name = 's' * 51
      expect(user).to_not be_valid
    end
  end
end
