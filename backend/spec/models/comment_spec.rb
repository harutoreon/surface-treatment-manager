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

  describe 'ロジックの検証' do
    describe '.user_comments' do
      before do
        comment.save       # commenter は 木下 太一
        @user = User.last  # user は Michael Hartl
      end

      context '引数に与えた user がコメントを投稿している場合' do
        it 'コメントが含まれた配列が返ること' do
          @user.name = '木下 太一'
          expect(Comment.user_comments(@user)).to include(comment)
        end
      end

      context '引数に与えた user がコメントを投稿していない場合' do
        it '空の配列が返ること' do
          @user = User.last
          expect(Comment.user_comments(@user)).to eq([])
        end
      end
    end
  end
end
