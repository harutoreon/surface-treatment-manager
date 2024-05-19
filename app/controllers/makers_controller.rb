class MakersController < ApplicationController
  before_action :logged_in_user, only: [:edit, :update, :destroy]
  before_action :admin_user, only: :destroy

  def index
    @makers = Maker.paginate(page: params[:page], per_page: 8)
  end

  def show
    @maker = Maker.find(params[:id])
  end

  def new
    @maker = Maker.new
  end

  def create
    @maker = Maker.new(maker_params)

    if @maker.save
      flash[:success] = "Successful registration of new maker!"
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
      flash[:success] = "Successful updated maker information!"
      redirect_to @maker
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @maker = Maker.find(params[:id])
    @maker.destroy
    flash[:success] = "Successful deleted maker!"
    redirect_to makers_url, status: :see_other
  end

  private

    def maker_params
      params.require(:maker).permit(:name, :postal_code, :address, :phone_number, :fax_number, :email, :home_page, :manufacturer_rep)
    end
end
