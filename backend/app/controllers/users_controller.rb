class UsersController < ApplicationController
  def index
    users = User.paginate(page: params[:page], per_page: 10)

    render json: {
      users: users, current_page: users.current_page, total_pages: users.total_pages
    },
    status: :ok
  end

  def show
    user = User.find(params[:id])

    render json: user, status: :ok
  end

  def create
    user = User.new(user_params)

    if user.save
      render json: user, status: :created, location: user
    else
      render json: user.errors, status: :unprocessable_entity
    end
  end

  def update
    user = User.find(params[:id])

    if user.update(user_params)
      render json: user, status: :ok
    else
      render json: user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    user = User.find(params[:id])
    user.destroy
    head :no_content
  end

  private

    def user_params
      params.require(:user).permit(:name, :department, :password, :password_confirmation)
    end
end
