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
end
