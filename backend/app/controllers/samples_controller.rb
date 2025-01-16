class SamplesController < ApplicationController
  def index
    @samples = Sample.all

    render json: @samples
  end

  def show
    @sample = Sample.find(params[:id])

    render json: @sample
  end

  def create
    @sample = Sample.new(sample_params)

    if @sample.save
      render json: @sample, status: created, location: @sample
    else
      render json: @sample.errors, status: :unprocessable_entity
    end
  end

  def update
    @sample = Sample.find(params[:id])

    if @sample.update(sample_params)
      render json: @sample
    else
      render json: @sample.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @sample = Sample.find(params[:id])
    @sample.destroy
  end

  private

    def sample_params
      params.require(:sample).permit(:name, :category, :color, :maker, :picture, :hardness, :film_thickness, :feature)
    end
end
