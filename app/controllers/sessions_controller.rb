class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by(name: params[:session][:name])

    if user && user.authenticate(params[:session][:password])
      log_in user
      redirect_to home_url
    else
      flash.now[:danger] = '名前とパスワードの組み合わせが無効です'
      render 'new', status: :unprocessable_entity
    end
  end

  def destroy
    log_out
    redirect_to login_url, status: :see_other
  end
end
