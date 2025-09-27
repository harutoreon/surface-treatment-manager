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
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    payload = JsonWebToken.decode(token)

    if payload
      render json: { payload: payload }, status: :ok
    else
      render json: { errors: 'invalid token' }, status: :unauthorized
    end
  end
end
