class SessionsController < ApplicationController
  def create
    user = User.find_by(name: params[:name])

    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      render json: { user: user }
    else
      render json: { error: 'Invalid name or password' }, status: :unprocessable_entity
    end
    
  end

  def destroy
    session[:user_id] = nil
  end
end
