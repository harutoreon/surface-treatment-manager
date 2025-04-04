class MakersController < ApplicationController
  def index
    makers = Maker.paginate(page: params[:page], per_page: 7)

    render json: {
      makers: makers, current_page: makers.current_page, total_pages: makers.total_pages
    }
  end

  def show
    @maker = Maker.find(params[:id])

    render json: @maker
  end

  def create
    @maker = Maker.new(maker_params)

    if @maker.save
      render json: @maker, status: :created, location: @maker
    else
      render json: @maker.errors, status: :unprocessable_entity
    end
  end

  def update
    @maker = Maker.find(params[:id])

    if @maker.update(maker_params)
      render json: @maker
    else
      render json: @maker.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @maker = Maker.find(params[:id])
    @maker.destroy
  end

  private

    def maker_params
      params.require(:maker).permit(:name, :postal_code, :address, :phone_number, :fax_number, :email, :home_page, :manufacturer_rep)
    end
end
