class CategoriesController < ApplicationController
  before_action :set_category, only: %i[show update destroy]

  def index
    categories = Category.order(:id)
    render json: categories, status: :ok
  end

  def show
    render json: @category, status: :ok
  end

  def create
    category = Category.new(category_params)

    if category.save
      render json: category, status: :created, location: category
    else
      render json: category.errors, status: :unprocessable_content
    end
  end

  def update
    if @category.update(category_params)
      render json: @category, status: :ok
    else
      render json: @category.errors, status: :unprocessable_content
    end
  end

  def destroy
    @category.destroy
    head :no_content
  end

  private

    def set_category
      @category = Category.find(params[:id])
    end
    def category_params
      params.require(:category).permit(:item, :summary)
    end
end
