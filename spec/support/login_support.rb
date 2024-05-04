module LoginSupport
  module Request
    def log_in(user)
      post login_path, params: { session: { name: user.name, password: user.password } }
    end

    def logged_in?
      !session[:user_id].nil?
    end
  end

  module System
    def log_in(user)
      visit login_path

      fill_in 'Name', with: user.name
      fill_in 'Password', with: user.password
      click_button 'Log in'
    end

    def login_as_general_user
      visit root_path
      choose('General user')
      click_button('Log in')
    end

    def login_as_admin_user
      visit root_path
      choose('Admin user')
      click_button('Log in')
    end

    def update_user_name(user, new_name)
      user.update(name: new_name)
    end
  end
end
