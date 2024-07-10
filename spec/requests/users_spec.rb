require 'rails_helper'

RSpec.describe "Users", type: :request do
  describe '#index' do
    it 'レスポンスが正常であること' do
      get users_path
      expect(response).to have_http_status(:success)
    end
    it 'タイトルが表示されること' do
      get users_path
      expect(response.body).to include('<title>ユーザーリスト</title>')
    end
  end

  describe '#show' do
    before do
      @user = FactoryBot.create(:user)
      log_in(@user)
    end

    it 'レスポンスが正常であること' do
      get user_path(@user)
      expect(response).to have_http_status(:success)
    end
    it '見出しが表示されること' do
      get user_path(@user)
      expect(response.body).to include('User Information')
    end
    it 'タイトルが表示されること' do
      get user_path(@user)
      expect(response.body).to include('<title>User Information</title>')
    end
  end

  describe "#new" do
    it "レスポンスが正常であること" do
      get new_user_path
      expect(response).to have_http_status(:success)
    end
    it '見出しが表示されること' do
      get new_user_path
      expect(response.body).to include('New Registration for User')
    end
    it 'タイトルが表示されること' do
      get new_user_path
      expect(response.body).to include('<title>New Registration for User</title>')
    end
  end

  describe '#create' do
    before do
      @user = FactoryBot.create(:user)
    end

    context '有効なユーザー情報のとき' do
      let(:user_params) { { user: { name: "sample user", department: "品質管理部", password: "password", password_confirmation: "password" } } }

      it '登録が成功すること' do
        expect{ post users_path, params: user_params }.to change{ User.count }.from(1).to(2)
      end
      it 'users/showページにリダイレクトすること' do
        post users_path, params: user_params
        new_user = User.last
        expect(response).to redirect_to new_user
      end
    end
    context '無効なユーザー情報のとき' do
      let(:user_params) { { user: { name: "", department: "品質管理部", password: "password", password_confirmation: "password" } } }

      it '登録が失敗すること' do
        expect{ post users_path, params: user_params }.to_not change{ User.count }.from(1)
      end
      it 'users/newページが表示されること' do
        post users_path, params: user_params
        expect(response.body).to include('New Registration for User')
      end
    end
  end

  describe '#edit' do
    context 'ログイン済みの場合' do
      before do
        @user = FactoryBot.create(:user)
        log_in(@user)
      end

      it 'レスポンスが正常であること' do
        get edit_user_path(@user)
        expect(response).to have_http_status(:success)
      end
      it '見出しが表示されること' do
        get edit_user_path(@user)
        expect(response.body).to include("Edit for User")
      end
      it 'タイトルが表示されること' do
        get edit_user_path(@user)
        expect(response.body).to include('<title>Edit for User</title>')
      end
    end
    context '未ログインの場合' do
      before do
        @user = FactoryBot.create(:user)
      end

      it "ログインページにリダイレクトされること" do
        get edit_user_path(@user)
        assert_redirected_to login_url
      end
      it 'フラッシュメッセージが表示されること' do
        get edit_user_path(@user)
        expect(flash[:danger]).to eq('Please log in.')
      end
    end
  end

  describe '#update' do
    before do
      @user = FactoryBot.create(:user)
    end

    context 'ログイン済みで' do
      before do
        log_in(@user)
      end

      context '有効な値の場合' do
        it '更新できること' do
          patch user_path(@user), params: { user: { name: 'sample user' } }
          @user.reload
          expect(@user.name).to eq('sample user')
        end
        it 'users/showページにリダイレクトされること' do
          patch user_path(@user), params: { user: { name: 'sample user' } }
          expect(response).to redirect_to @user
        end
        it 'フラッシュメッセージが表示されていること' do
          patch user_path(@user), params: { user: { name: 'sample user' } }
          expect(flash).to be_any
        end
      end
      context '無効な値の場合' do
        it '更新できないこと' do
          patch user_path(@user), params: { user: { name: '' } }
          @user.reload
          expect(@user.name).to_not eq('')
        end
        it 'users/editページが表示されること' do
          patch user_path(@user), params: { user: { name: '' } }
          expect(response.body).to include('Edit for User')
        end
      end
    end
    context '未ログインの場合' do
      it "ログインページにリダイレクトされること" do
        patch user_path(@user), params: { user: { name: 'sample user' } }
        assert_redirected_to login_url
      end
      it 'フラッシュメッセージが表示されること' do
        patch user_path(@user), params: { user: { name: 'sample user' } }
        expect(flash[:danger]).to eq('Please log in.')
      end
    end
  end

  describe '#destroy' do
    before do
      @sample_user = FactoryBot.create(:sample_user)
    end

    context '管理者ユーザーでログインした場合' do
      before do
        @admin_user = FactoryBot.create(:admin_user)
        log_in(@admin_user)
      end

      it '削除に成功すること' do
        expect { delete user_path(@sample_user) }.to change{ User.count }.from(2).to(1)
      end
      it 'users/indexページにリダイレクトされること' do
        delete user_path(@sample_user)
        expect(response).to redirect_to users_url
        expect(flash[:success]).to eq('Successful deleted user!')
      end
    end
    context '一般ユーザーでログインした場合' do
      before do
        @general_user = FactoryBot.create(:general_user)
        log_in(@general_user)
      end

      it '削除に失敗すること' do
        expect { delete user_path(@sample_user) }.to_not change{ User.count }.from(2)
      end
      it 'ログインページにリダイレクトされること' do
        delete user_path(@sample_user)
        expect(response).to redirect_to login_url
      end
    end
    context '未ログインの場合' do
      it '削除に失敗すること' do
        expect { delete user_path(@sample_user) }.to_not change{ User.count }.from(1)
      end

      it "ログインページにリダイレクトされること" do
        delete user_path(@sample_user)
        expect(response).to redirect_to login_url
        expect(flash[:danger]).to eq('Please log in.')
      end
    end
  end
end
