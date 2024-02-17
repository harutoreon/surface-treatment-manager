class CategoriesController < ApplicationController
  def show
    @category = Category.find(params[:id])
  end

  def new
    @category = Category.new
  end

  def create
    @category = Category.new(category_params)

    if @category.save
      # redirect_to @category
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

    def category_params
      params.require(:category).permit(:item)
    end
end
