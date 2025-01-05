class SamplesController < ApplicationController
  before_action :logged_in_user, only: [:edit, :update, :destroy]
  before_action :admin_user, only: :destroy

  def index
    @samples = Sample.paginate(page: params[:page], per_page: 8)
  end

  def show
    @sample = Sample.find(params[:id])
  end

  def new
    @sample = Sample.new
  end

  def create
    @sample = Sample.new(sample_params)

    if @sample.save
      flash[:success] = "表面処理の登録に成功しました!"
      redirect_to @sample
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @sample = Sample.find(params[:id])
  end

  def update
    @sample = Sample.find(params[:id])

    if @sample.update(sample_params)
      flash[:success] = "表面処理の更新に成功しました!"
      redirect_to @sample
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @sample = Sample.find(params[:id])
    @sample.destroy
    flash[:success] = "表面処理の削除に成功しました!"
    redirect_to samples_url, status: :see_other
  end

  private

    def sample_params
      params.require(:sample).permit(:name, :category, :color, :maker, :picture, :hardness, :film_thickness, :feature)
    end
end
