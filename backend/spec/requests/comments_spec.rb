require 'rails_helper'

RSpec.describe "Comments API", type: :request do
  describe '#index' do
    let!(:comment) { FactoryBot.create(:comment) }

    it 'レスポンスのステータスがokであること' do
      get maker_sample_comments_path(comment.sample.maker, comment.sample)
      expect(response).to have_http_status(:ok)
    end

    it 'コメントの件数が1件返ること' do
      get maker_sample_comments_path(comment.sample.maker, comment.sample)
      expect(response.parsed_body.size).to eq(1)
    end
  end

  describe '#show' do
    let!(:comment) { FactoryBot.create(:comment) }

    it 'レスポンスのステータスがokであること' do
      get maker_sample_comment_path(comment.sample.maker, comment.sample, comment)
      expect(response).to have_http_status(:ok)
    end

    it 'コメントの詳細が返ること' do
      get maker_sample_comment_path(comment.sample.maker, comment.sample, comment)
      json = response.parsed_body
      expect(json[:commenter]).to eq("木下 太一")
      expect(json[:department]).to eq("品質管理部")
      expect(json[:body]).to eq("変寸量が一定ではありません。")
    end
  end

  describe "#create" do
    let!(:sample) { FactoryBot.create(:sample) }
    let!(:user) { FactoryBot.create(:user) }
    let(:params) do
      { comment: { commenter: commenter,
                   department: 'department',
                   body: 'sample comment.',
                   user_id: user.id } }
    end

    context '有効なコメント情報で登録したとき' do
      let(:commenter) { 'sample commenter' }

      it 'レスポンスのステータスがcreatedであること' do
        post maker_sample_comments_path(sample.maker, sample), params: params
        expect(response).to have_http_status(:created)
      end

      it 'データベースのコメント数が増加し、headerにlocationが追加されること' do
        expect {
          post maker_sample_comments_path(sample.maker, sample), params: params
        }.to change{ Comment.count }.from(0).to(1)

        comment = Comment.last
        expect(
          response.header["Location"]
        ).to eq(maker_sample_comment_url(comment.sample.maker, comment.sample, comment))
      end
    end

    context '無効なコメント情報で登録したとき' do
      let(:commenter) { '' }

      it 'レスポンスのステータスがunprocessable_contentであること' do
        post maker_sample_comments_path(sample.maker, sample), params: params
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'データベースに登録されないこと' do
        expect {
          post maker_sample_comments_path(sample.maker, sample), params: params
        }.to_not change{ Comment.count }.from(0)
      end
    end
  end

  describe '#update' do
    let!(:comment) { FactoryBot.create(:comment) }

    context '有効なコメント情報で更新したとき' do
      it 'レスポンスのステータスがokであること' do
        patch maker_sample_comment_path(comment.sample.maker, comment.sample, comment),
          params: { comment: { commenter: 'sample user' } }
        expect(response).to have_http_status(:ok)
      end

      it 'commenterがsample userで更新されること' do
        patch maker_sample_comment_path(comment.sample.maker, comment.sample, comment),
          params: { comment: { commenter: 'sample user' } }
        expect(comment.reload.commenter).to eq('sample user')
      end
    end

    context '無効なコメント情報で更新したとき' do
      it 'レスポンスがunprocessable_contentであること' do
        patch maker_sample_comment_path(comment.sample.maker, comment.sample, comment),
          params: { comment: { commenter: '' } }
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'commenterが空白で更新できないこと' do
        patch maker_sample_comment_path(comment.sample.maker, comment.sample, comment),
          params: { comment: { commenter: '' } }
        expect(comment.reload.commenter).to eq('木下 太一')
        expect(response.parsed_body[:commenter]).to eq(["投稿者名が空白です。"])
      end
    end
  end

  describe '#destroy' do
    let!(:comment) { FactoryBot.create(:comment) }

    it 'レスポンスのステータスがno_contentであること' do
      delete maker_sample_comment_path(comment.sample.maker, comment.sample, comment)
      expect(response).to have_http_status(:no_content)
    end

    it 'コメントが1件削除され、レスポンスの本文は空であること' do
      expect {
        delete maker_sample_comment_path(comment.sample.maker, comment.sample, comment)
      }.to change{ Comment.count }.from(1).to(0)

      expect(response.body).to be_blank
    end
  end

  describe '#comment_list' do
    let!(:comment) { FactoryBot.create(:comment) }

    it 'レスポンスのステータスがokであること' do
      get comment_list_path
      expect(response).to have_http_status(:ok)
    end

    it 'レスポンスにcomments/current_page/total_pagesが含まれていること' do
      get comment_list_path
      json = response.parsed_body
      expect(json[:comments].size).to eq(1)
      expect(json[:current_page]).to eq(1)
      expect(json[:total_pages]).to eq(1)
    end
  end

  describe '#comment_information' do
    let!(:comment) { FactoryBot.create(:comment) }

    it 'レスポンスのステータスがokであること' do
      get comment_information_path(comment)
      expect(response).to have_http_status(:ok)      
    end
    
    it 'コメント情報が返ること' do
      get comment_information_path(comment)
      json = response.parsed_body
      expect(json[:comment][:commenter]).to eq(comment.commenter)
      expect(json[:comment][:body]).to eq(comment.body)
      expect(json[:comment][:department]).to eq(comment.department)
    end
  end
end
