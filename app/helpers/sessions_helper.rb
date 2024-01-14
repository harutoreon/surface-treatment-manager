module SessionsHelper
  def log_in(user)
    session[:user_id] = user.id
  end

  def current_user
    if session[:user_id]
      @current_user ||= User.find_by(id: session[:user_id])
    end
  end

  # ログインしないとメイン画面（samples_path）に飛ばない仕様にするため、
  # このメソッドはコメントアウトする
  # def logged_in?
  #   !current_user.nil?
  # end
end
