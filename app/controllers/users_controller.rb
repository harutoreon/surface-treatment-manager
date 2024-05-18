class UsersController < ApplicationController
  before_action :logged_in_user, only: [:edit, :update, :destroy]
  before_action :admin_user, only: :destroy

  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      flash[:success] = "Successful registration of new user!"
      redirect_to @user
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])

    if @user.update(user_params)
      flash[:success] = "Successful updated user information!"
      redirect_to @user
    else
      render 'edit', status: :unprocessable_entity
    end
  end

  def destroy
    User.find(params[:id]).destroy
    flash[:success] = "Successful deleted user!"
    redirect_to users_url, status: :see_other
  end

  private

    def user_params
      params.require(:user).permit(:name, :password, :password_confirmation)
    end

  # def admin_user
  #   redirect_to(login_url) unless current_user.admin?
  # end
end
