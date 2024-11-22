require 'rails_helper'

RSpec.describe "Comments", type: :request do
  before do
    @sample = FactoryBot.create(:sample)
  end

  describe "#create" do
    before do
      general_user = FactoryBot.create(:general_user)
      log_in(general_user)
    end

    context '有効な値の場合' do
      before do
        @valid_comment_params = { comment: { commenter: 'sample user', body: 'sample comment.' } }
      end

      it '登録が成功すること' do
        expect { post sample_comments_path(@sample), params: @valid_comment_params }.to change{ Comment.count }.from(0).to(1)
      end

      it 'samples/showページにリダイレクトされること' do
        post sample_comments_path(@sample), params: @valid_comment_params
        expect(response).to redirect_to(@sample)
      end

      it 'フラッシュメッセージが表示されること' do
        post sample_comments_path(@sample), params: @valid_comment_params
        expect(flash['success']).to eq('コメントを1件追加しました。')
      end
    end

    context '無効な値の場合' do
      before do
        @invalid_comment_params = { comment: { commenter: '', body: 'sample comment.' } }
      end

      it '登録に失敗すること' do
        expect { post sample_comments_path(@sample), params: @invalid_comment_params }.to_not change{ Comment.count }.from(0)
      end

      it 'samples/showページを再表示すること' do
        post sample_comments_path(@sample), params: @invalid_comment_params
        expect(response.body).to include('表面処理情報')
      end

      it 'フラッシュメッセージが表示されること' do
        post sample_comments_path(@sample), params: @invalid_comment_params
        expect(flash['danger']).to eq('コメントの投稿者またはコメントが無効です。')
      end
    end
  end

  describe '#destroy' do
    before do
      @comment = @sample.comments.create(commenter: 'sample user', body: 'sample comment.')
    end

    context '管理者ユーザーでログインした場合' do
      before do
        admin_user = FactoryBot.create(:admin_user)
        log_in(admin_user)
      end

      it 'レコード数が減少すること' do
        expect { delete sample_comment_path(@sample, @comment) }.to change{ Comment.count }.from(1).to(0)
      end

      it 'samples/showにリダイレクトすること' do
        delete sample_comment_path(@sample, @comment)
        expect(response).to redirect_to(@sample)
      end

      it 'flash変数に:successが格納されること' do
        delete sample_comment_path(@sample, @comment)
        expect(flash[:success]).to eq('コメントの削除に成功しました!')
      end
    end

    context '一般ユーザーでログインした場合' do
      before do
        general_user = FactoryBot.create(:general_user)
        log_in(general_user)
      end

      it 'レコード数が変わらないこと' do
        expect { delete sample_comment_path(@sample, @comment) }.to_not change{ Comment.count }.from(1)
      end

      it "ログインページにリダイレクトされること" do
        delete sample_comment_path(@sample, @comment)
        expect(response).to redirect_to(login_url)
      end
    end

    context '未ログインの場合' do
      it "ログインページにリダイレクトされること" do
        delete sample_comment_path(@sample, @comment)
        expect(response).to redirect_to(login_url)
      end

      it "フラッシュメッセージが表示されること" do
        delete sample_comment_path(@sample, @comment)
        expect(flash[:danger]).to eq('ログインしてください')
      end
    end
  end
end
