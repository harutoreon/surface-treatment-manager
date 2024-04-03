class SamplesController < ApplicationController
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
      flash[:success] = "Successful registration of new surface treatment!"
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
      flash[:success] = "Successful updated user information!"
      redirect_to @sample
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @sample = Sample.find(params[:id])
    @sample.destroy
    flash[:success] = "Successful deleted surface treatment!"
    redirect_to samples_url, status: :see_other
  end

  private

    def sample_params
      params.require(:sample).permit(:name, :category, :color, :maker, :picture)
    end
end
