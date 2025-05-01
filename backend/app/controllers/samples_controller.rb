class SamplesController < ApplicationController
  def index
    samples = Sample.paginate(page: params[:page], per_page: 7)

    render json: {
      samples: samples,
      current_page: samples.current_page,
      total_pages: samples.total_pages
    }
  end

  def show
    @sample = Sample.find(params[:id])

    render json: @sample, methods: [:image_url]
  end

  def create
    @sample = Sample.new(sample_params)

    if @sample.save
      render json: @sample, status: :created, location: @sample
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
    
    head :no_content
  end

  private

    def sample_params
      params.require(:sample).permit(:name, :category, :color, :maker, :hardness, :film_thickness, :feature, :image)
    end
end
