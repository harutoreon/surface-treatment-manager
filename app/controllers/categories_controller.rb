class CategoriesController < ApplicationController
  # before_action :admin_user

  def index
    @categories = Category.all
  end

  def show
    @category = Category.find(params[:id])
  end

  def new
    @category = Category.new
  end

  def create
    @category = Category.new(category_params)

    if @category.save
      flash[:success] = "Successful registration of new category!"
      redirect_to @category
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @category = Category.find(params[:id])
  end

  def update
    @category = Category.find(params[:id])

    if @category.update(category_params)
      flash[:success] = "Successful updated category information!"
      redirect_to @category
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @category = Category.find(params[:id])
    @category.destroy
    flash[:success] = "Successful deleted category!"
    redirect_to categories_url, status: :see_other
  end

  private

    def category_params
      params.require(:category).permit(:item)
    end

    def admin_user
      redirect_to(login_url) unless current_user.admin?
    end
end
