class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by(name: params[:session][:name])

    if user && user.authenticate(params[:session][:password])
      log_in user
      redirect_to samples_path
    else
      flash.now[:danger] = 'Invalid name/password combination'
      render 'new', status: :unprocessable_entity
    end
  end

  def destroy
  end
end
