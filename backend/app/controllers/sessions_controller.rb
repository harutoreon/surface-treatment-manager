class SessionsController < ApplicationController
  def create
    user = User.find_by(name: params[:name])

    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      render json: { logged_in: true, user: user }, status: :ok
    else
      render json: { logged_in: false, error: 'Invalid name or password' }, status: :unprocessable_entity
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
