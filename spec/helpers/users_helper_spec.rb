require 'rails_helper'

RSpec.describe UsersHelper, type: :helper do
  describe '#user_class' do
    before do
      @admin_user   = FactoryBot.create(:admin_user)
      @general_user = FactoryBot.create(:general_user)
    end

    it '「admin」が返ること' do
      expect(user_class(@admin_user)).to eq('admin')
    end
    it '「general」が返ること' do
      expect(user_class(@general_user)).to eq('general')
    end
  end
end
