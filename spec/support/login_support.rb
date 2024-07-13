module LoginSupport
  module Request
    def log_in(user)
      post login_path, params: { session: { name: user.name,
                                            department: user.department,
                                            password: user.password } }
    end

    def logged_in?
      !session[:user_id].nil?
    end
  end

  module System
    def log_in(user)
      visit login_path

      fill_in 'ユーザー名', with: user.name
      fill_in 'パスワード', with: user.password
      click_button 'ログイン'
    end

    def login_as_general_user
      visit root_path
      choose('一般ユーザー')
      click_button('ログイン')
    end

    def login_as_admin_user
      visit root_path
      choose('管理者ユーザー')
      click_button('ログイン')
    end

    def update_user_name(user, new_name)
      user.update(name: new_name)
    end
  end
end
