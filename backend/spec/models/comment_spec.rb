require 'rails_helper'

RSpec.describe Comment, type: :model do
  describe 'validation' do
    before do
      sample = FactoryBot.build(:sample)

      sample.image.attach(
        io: File.open(Rails.root + 'spec/fixtures/test.jpg'),
        filename: 'test.jpg',
        content_type: 'image/jpg'
      )

      sample.save
      
      @comment = FactoryBot.build(:comment)
    end

    it 'commentオブジェクトが有効であること' do
      expect(@comment).to be_valid
    end

    it 'commenterが存在すること' do
      @comment.commenter = ''
      expect(@comment).to_not be_valid
    end

    it 'departmentが存在すること' do
      @comment.department = ''
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
