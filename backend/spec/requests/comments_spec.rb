require 'rails_helper'

RSpec.describe "Comments API", type: :request do
  describe '#index' do
    before do
      FactoryBot.create(:maker)
      @sample = FactoryBot.create(:sample)
      FactoryBot.create_list(:comment, 10)
      @comment = Comment.first
    end

    it 'レスポンスのステータスがokであること' do
      get "/makers/#{@sample.maker_id}/samples/#{@comment.sample_id}/comments"
      expect(response).to have_http_status(:ok)
    end

    it 'コメントの件数が10件返ること' do
      get "/makers/#{@sample.maker_id}/samples/#{@comment.sample_id}/comments"
      json = JSON.parse(response.body)
      expect(json.count).to eq(10)
    end
  end

  describe '#show' do
    before do
      FactoryBot.create(:maker)
      @sample = FactoryBot.create(:sample)
      @comment = FactoryBot.create(:comment)
    end

    it 'レスポンスのステータスがokであること' do
      get "/makers/#{@sample.maker_id}/samples/#{@comment.sample_id}/comments/#{@comment.id}"
      expect(response).to have_http_status(:ok)
    end

    it 'コメントの詳細が返ること' do
      get "/makers/#{@sample.maker_id}/samples/#{@comment.sample_id}/comments/#{@comment.id}"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json[:commenter]).to eq("木下 太一")
      expect(json[:department]).to eq("品質管理部")
      expect(json[:body]).to eq("変寸量が一定ではありません。")
    end
  end

  describe "#create" do
    before do
      FactoryBot.create(:maker)
      @sample = FactoryBot.create(:sample)
    end

    context '有効なコメント情報で登録したとき' do
      before do
        @valid_comment_params = { comment: { commenter: 'sample user',
                                             department: 'department',
                                             body: 'sample comment.' } }
      end

      it 'レスポンスのステータスがcreatedであること' do
        post "/makers/#{@sample.maker_id}/samples/#{@sample.id}/comments", params: @valid_comment_params
        expect(response).to have_http_status(:created)
      end

      it 'headerのlocationが登録したコメントを参照していること' do
        post "/makers/#{@sample.maker_id}/samples/#{@sample.id}/comments", params: @valid_comment_params
        comment = Comment.last
        expect(response.header["Location"]).to eq("http://www.example.com/makers/#{@sample.maker_id}/samples/#{comment.sample_id}/comments/#{comment.id}")
      end

      it 'データベースのコメント数が1件増えること' do
        expect { post "/makers/#{@sample.maker_id}/samples/#{@sample.id}/comments", params: @valid_comment_params }.to change{ Comment.count }.from(0).to(1)
      end
    end

    context '無効なコメント情報で登録したとき' do
      before do
        @invalid_comment_params = { comment: { commenter: '',
                                               department: 'department',
                                               body: 'sample comment.' } }
      end

      it 'レスポンスのステータスがunprocessable_entityであること' do
        post "/makers/#{@sample.maker_id}/samples/#{@sample.id}/comments", params: @invalid_comment_params
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'データベースに登録されないこと' do
        expect { post "/makers/#{@sample.maker_id}/samples/#{@sample.id}/comments", params: @invalid_comment_params }.to_not change{ Comment.count }.from(0)
      end
    end
  end

  describe '#update' do
    before do
      FactoryBot.create(:maker)
      @sample = FactoryBot.create(:sample)
      @comment = FactoryBot.create(:comment)
    end

    context '有効なコメント情報で更新したとき' do
      it 'レスポンスのステータスがokであること' do
        patch "/makers/#{@sample.maker_id}/samples/#{@comment.sample_id}/comments/#{@comment.id}", params: { comment: { commenter: 'sample user' } }
        expect(response).to have_http_status(:ok)
      end

      it 'commenterがsample userで更新されること' do
        patch "/makers/#{@sample.maker_id}/samples/#{@comment.sample_id}/comments/#{@comment.id}", params: { comment: { commenter: 'sample user' } }
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:commenter]).to eq("sample user")
      end
    end

    context '無効なコメント情報で更新したとき' do
      it 'レスポンスがunprocessable_entityであること' do
        patch "/makers/#{@sample.maker_id}/samples/#{@comment.sample_id}/comments/#{@comment.id}", params: { comment: { commenter: '' } }
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'commenterが空白で更新できないこと' do
        patch "/makers/#{@sample.maker_id}/samples/#{@comment.sample_id}/comments/#{@comment.id}", params: { comment: { commenter: '' } }
        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:commenter]).to eq(["（投稿者名）が空白です。"])
      end
    end
  end

  describe '#destroy' do
    before do
      FactoryBot.create(:maker)
      @sample = FactoryBot.create(:sample)
      @comment = FactoryBot.create(:comment)
    end

    it 'レスポンスのステータスがno_contentであること' do
      delete "/makers/#{@sample.maker_id}/samples/#{@comment.sample_id}/comments/#{@comment.id}"
      expect(response).to have_http_status(:no_content)
    end

    it 'レスポンスのbodyが空であること' do
      delete "/makers/#{@sample.maker_id}/samples/#{@comment.sample_id}/comments/#{@comment.id}"
      expect(response.body).to be_blank
    end

    it 'コメントが1件削除されること' do
      expect {
        delete "/makers/#{@sample.maker_id}/samples/#{@comment.sample_id}/comments/#{@comment.id}"
      }.to change{ Comment.count }.from(1).to(0)
    end
  end

  describe '#comment_list' do
    before do
      FactoryBot.create(:maker)
      FactoryBot.create(:sample)
      FactoryBot.create_list(:comment, 10)
    end

    it 'レスポンスのステータスがokであること' do
      get "/comments"
      expect(response).to have_http_status(:ok)      
    end

    it 'コメントの件数が10件含まれていること' do
      get "/comments"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json[:comments].count).to eq(10)
    end

    it 'current_pageとtotal_pagesが含まれていること' do
      get "/comments"
      json = JSON.parse(response.body, symbolize_names: true)
      expect(json[:current_page]).to eq(1)
      expect(json[:total_pages]).to eq(1)
    end
  end

  describe '#comment_information' do
    before do
      FactoryBot.create(:maker)
      FactoryBot.create(:sample)
      @comment = FactoryBot.create(:comment)
    end

    it 'レスポンスのステータスがokであること' do
      get "/comments/#{@comment.id}"
      expect(response).to have_http_status(:ok)      
    end
    
    it 'コメント情報が返ること' do
      get "/comments/#{@comment.id}"
      json = JSON.parse(response.body, symbolize_names: true)
      
      expect(json[:comment][:commenter]).to eq('木下 太一')
      expect(json[:comment][:body]).to eq('変寸量が一定ではありません。')
      expect(json[:comment][:department]).to eq('品質管理部')
    end
  end
end
