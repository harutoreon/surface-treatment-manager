require 'rails_helper'

RSpec.describe Comment, type: :model do
  describe 'validation' do
    before do
      sample = FactoryBot.create(:sample)
      @comment = sample.comments.build(commenter: 'commenter', body: 'sample comment.')
    end

    it 'commentオブジェクトが有効であること' do
      expect(@comment).to be_valid
    end

    it 'commenterが存在すること' do
      @comment.commenter = ''
      expect(@comment).to_not be_valid
    end

    it 'bodyが存在すること' do
      @comment.body = ''
      expect(@comment).to_not be_valid
    end

    it 'sample_idが存在すること' do
      @comment.sample_id = nil
      expect(@comment).to_not be_valid
    end
  end
end
