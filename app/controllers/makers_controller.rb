class MakersController < ApplicationController
  def show
    @maker = Maker.find(params[:id])
  end

  def new
    @maker = Maker.new
  end

  def create
    @maker = Maker.new(maker_params)

    if @maker.save
      redirect_to @maker
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @maker = Maker.find(params[:id])
  end

  def update
    @maker = Maker.find(params[:id])

    if @maker.update(maker_params)
      redirect_to @maker
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @maker = Maker.find(params[:id])
    @maker.destroy

    redirect_to makers_url, status: :see_other
  end

  private

    def maker_params
      params.require(:maker).permit(:name, :postal_code, :address, :phone_number, :fax_number, :email, :home_page, :manufacturer_rep)
    end
end
