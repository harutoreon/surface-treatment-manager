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
      let(:valid_params) { { comment: { commenter: 'sample user', body: 'sample comment.' } } }

      it '登録が成功すること' do
        expect { post sample_comments_path(@sample), params: valid_params }.to change{ Comment.count }.from(0).to(1)
      end
      it 'samples/showページにリダイレクトされること' do
        post sample_comments_path(@sample), params: valid_params
        expect(response).to redirect_to(@sample)
        expect(flash['success']).to eq('1 comment added.')
      end
    end
    context '無効な値の場合' do
      let(:invalid_params) { { comment: { commenter: '', body: 'sample comment.' } } }

      it '登録に失敗すること' do
        expect { post sample_comments_path(@sample), params: invalid_params }.to_not change{ Comment.count }.from(0)
      end
      it 'samples/showページを再表示すること' do
        post sample_comments_path(@sample), params: invalid_params
        expect(response.body).to include('表面処理情報')
        expect(flash['danger']).to eq('Invalid commenter or comment.')
      end
    end
  end

  describe '#destroy' do
    before do
      @comment = @sample.comments.create(commenter: 'sample user', body: 'sample comment.')
    end

    context 'ログイン済みの場合' do
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
    end
    context '未ログインの場合' do
      it "ログインページにリダイレクトされること" do
        delete sample_comment_path(@sample, @comment)
        expect(response).to redirect_to(login_url)
        expect(flash[:danger]).to eq('Please log in.')
      end
    end
  end
end
