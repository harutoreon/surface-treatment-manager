require 'rails_helper'

RSpec.describe "Users", type: :request do
  describe '#index' do
    it 'レスポンスが正常であること' do
      get users_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get users_path
      expect(response.body).to include('Users Index')
    end

    it 'タイトルが表示されること' do
      get users_path
      expect(response.body).to include('<title>Users Index</title>')
    end
  end

  describe '#show' do
    let!(:user) { FactoryBot.create(:user) }

    it 'レスポンスが正常であること' do
      get user_path(user)
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get user_path(user)
      expect(response.body).to include('User Profile')
    end

    it 'タイトルが表示されること' do
      get user_path(user)
      expect(response.body).to include('<title>User Profile</title>')
    end
  end

  describe "#new" do
    it "レスポンスが正常であること" do
      get signup_path
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get signup_path
      expect(response.body).to include('Sign up')
    end

    it 'タイトルが表示されること' do
      get signup_path
      expect(response.body).to include('<title>Sign up</title>')
    end
  end

  describe '#create' do
    context '無効なユーザー情報のとき' do
      let(:user_params) { { user: { name: "", password: "foobar", password_confirmation: "foobar" } } }

      it '登録が失敗すること' do
        expect{ post users_path, params: user_params }.to_not change{ User.count }.from(0)
      end
    end

    context '有効なユーザー情報のとき' do
      let(:user_params) { { user: { name: "foobar", password: "foobar", password_confirmation: "foobar" } } }

      it '登録が成功すること' do
        expect{ post users_path, params: user_params }.to change{ User.count }.from(0).to(1)
      end

      it 'ログイン状態であること' do
        post users_path, params: user_params
        expect(logged_in?).to be_truthy
      end
    end
  end

  describe '#edit' do
    let!(:user) { FactoryBot.create(:user) }

    it 'レスポンスが正常であること' do
      get edit_user_path(user)
      expect(response).to have_http_status(:success)
    end

    it '見出しが表示されること' do
      get edit_user_path(user)
      expect(response.body).to include("User Edit")
    end

    it 'タイトルが表示されること' do
      get edit_user_path(user)
      expect(response.body).to include('<title>User Edit</title>')
    end
  end

  describe '#update' do
    let!(:user) { FactoryBot.create(:user) }

    context '無効な値の場合' do
      it '更新できないこと' do
        patch user_path(user), params: { user: { name: '', password: 'foo', password_confirmation: 'bar' } }

        user.reload
        expect(user.name).to_not eq('')
        expect(user.password).to_not eq('foo')
        expect(user.password_confirmation).to_not eq('bar')
      end

      it 'editページが表示されること' do
        patch user_path(user), params: { user: { name: '', password: 'foo', password_confirmation: 'bar' } }

        expect(response.body).to include("User Edit")
      end
    end

    context '有効な値の場合' do
      it '更新できること' do
        patch user_path(user), params: { user: { name: 'Example User', password: 'foobar', password_confirmation: 'foobar' } }

        user.reload
        expect(user.name).to eq('Example User')
        expect(user.password).to eq('foobar')
        expect(user.password_confirmation).to eq('foobar')
      end

      it 'showページにリダイレクトされること' do
        patch user_path(user), params: { user: { name: 'Example User', password: 'foobar', password_confirmation: 'foobar' } }

        expect(response).to redirect_to user
      end

      it 'フラッシュメッセージが表示されていること' do
        patch user_path(user), params: { user: { name: 'Example User', password: 'foobar', password_confirmation: 'foobar' } }

        expect(flash).to be_any
      end
    end
  end

  describe '#destroy' do
    let!(:user)       { FactoryBot.create(:user) }
    let!(:other_user) { FactoryBot.create(:archer) }

    context 'ログインしてないユーザーであれば' do
      it '削除できないこと' do
        expect { delete user_path(user) }.to_not change{ User.count }.from(2)
      end

      it 'ログイン画面にリダイレクトされること' do
        delete user_path(user)
        expect(response).to redirect_to login_url
      end
    end

    context 'ログイン済みユーザーでも管理者ユーザーでなければ' do
      it '削除できないこと' do
        log_in(other_user)
        expect { delete user_path(user) }.to_not change{ User.count }.from(2)
      end

      it 'ログイン画面にリダイレクトされること' do
        log_in(other_user)
        delete user_path(user)
        expect(response).to redirect_to login_url
      end
    end

    context '管理者ユーザーでログインすれば' do
      it '削除できること' do
        log_in(user)
        expect { delete user_path(other_user) }.to change{ User.count }.from(2).to(1)
      end

      it 'サンプル一覧画面にリダイレクトされること' do
        log_in(user)
        delete user_path(other_user)
        expect(response).to redirect_to home_url
      end
    end
  end
end
