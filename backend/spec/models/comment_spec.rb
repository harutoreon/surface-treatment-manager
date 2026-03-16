require 'rails_helper'

RSpec.describe Comment, type: :model do
  let(:comment) { FactoryBot.build(:comment) }

  describe '有効性の検証' do
    it 'オブジェクトが有効であること' do
      expect(comment).to be_valid
    end
  end

  describe '存在性の検証' do
    it 'commenterが空文字だと無効であること' do
      comment.commenter = ''
      comment.valid?
      expect(comment.errors.details[:commenter]).to include(error: :blank)
    end

    it 'departmentが空文字だと無効であること' do
      comment.department = ''
      comment.valid?
      expect(comment.errors.details[:department]).to include(error: :blank)
    end

    it 'bodyが空文字だと無効であること' do
      comment.body = ''
      comment.valid?
      expect(comment.errors.details[:body]).to include(error: :blank)
    end
  end
end
