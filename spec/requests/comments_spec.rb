require 'rails_helper'

RSpec.describe "Comments", type: :request do
  before do
    @sample = FactoryBot.create(:sample)
  end

  describe "#create" do
    context '登録に成功した場合' do
      let(:valid_params) { { comment: { commenter: 'sample user', body: 'sample comment.' } } }

      it 'レコード数が増加すること' do
        expect { post sample_comments_path(@sample), params: valid_params }.to change{ Comment.count }.from(0).to(1)
      end
      it 'samples/showにリダイレクトされること' do
        post sample_comments_path(@sample), params: valid_params
        expect(response).to redirect_to(@sample)
      end
      it '「1 comment added.」のフラッシュメッセージが表示されること' do
        post sample_comments_path(@sample), params: valid_params
        expect(flash['success']).to eq('1 comment added.')
      end
    end
    context '登録に失敗した場合' do
      let(:invalid_params) { { comment: { commenter: '', body: 'sample comment.' } } }

      it 'レコード数が変化しないこと' do
        expect { post sample_comments_path(@sample), params: invalid_params }.to_not change{ Comment.count }.from(0)
      end
      it 'samples/showを再描画すること' do
        post sample_comments_path(@sample), params: invalid_params
        expect(response.body).to include('Surface Treatment Information')
      end
      it '「Invalid commenter or comment.」のフラッシュメッセージが表示されること' do
        post sample_comments_path(@sample), params: invalid_params
        expect(flash['danger']).to eq('Invalid commenter or comment.')
      end
    end
  end

  describe '#destroy' do
    before do
      @comment = @sample.comments.create(commenter: 'sample user', body: 'sample comment.')
      user = FactoryBot.create(:user)
      log_in(user)
    end

    it 'レコード数が減少すること' do
      expect { delete sample_comment_path(@sample, @comment) }.to change{ Comment.count }.from(1).to(0)
    end
    it 'samples/showにリダイレクトすること' do
      delete sample_comment_path(@sample, @comment)
      expect(response).to redirect_to(@sample)
    end
  end
end
