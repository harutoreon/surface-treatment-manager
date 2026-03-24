class UsersController < ApplicationController
  before_action :set_user, only: %i[show update destroy]

  def index
    users = User.order(:id).displayable.paginate(page: params[:page], per_page: 10)

    render json: {
      users: users, current_page: users.current_page, total_pages: users.total_pages
    },
    status: :ok
  end

  def show
    render json: @user, status: :ok
  end

  def create
    user = User.new(user_params)

    if user.save
      render json: user, status: :created, location: user
    else
      render json: user.errors, status: :unprocessable_content
    end
  end

  def update
    if @user.update(user_params)
      render json: @user, status: :ok
    else
      render json: @user.errors, status: :unprocessable_content
    end
  end

  def destroy
    @user.destroy
    head :no_content
  end

  def user_list
    users = User.order(:id)
    render json: users, status: :ok
  end

  private

    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(:name, :department, :password, :password_confirmation)
    end
end
