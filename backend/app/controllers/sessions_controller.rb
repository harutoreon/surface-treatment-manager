class SessionsController < ApplicationController
  def create
    user = User.find_by(name: params[:name])

    if user && user.authenticate(params[:password])
      token = JsonWebToken.encode({ user_id: user.id })
      render json: { token: token }, status: :ok
    else
      render json: { error: 'invalid credentials' }, status: :unauthorized
    end
  end

  def destroy
    session[:user_id] = nil
    render json: { logged_in: false }, status: :ok
  end

  def logged_in
    if session[:user_id]
      render json: { logged_in: true }, status: :ok
    else
      render json: { logged_in: false }, status: :unauthorized
    end
  end
end
