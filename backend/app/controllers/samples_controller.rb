class SamplesController < ApplicationController
  before_action :set_maker, only: %i[index show create update destroy]
  before_action :set_sample, only: %i[show update destroy]

  def index
    samples = @maker.samples.order(:id).paginate(page: params[:page], per_page: 7)

    render json: {
      samples: samples,
      current_page: samples.current_page,
      total_pages: samples.total_pages
    },
    status: :ok
  end

  def show
    render json: @sample, status: :ok, methods: [:image_url]
  end

  def create
    sample = @maker.samples.build(sample_params)

    if sample.save
      render json: sample, status: :created, location: maker_sample_url(@maker, sample)
    else
      render json: sample.errors, status: :unprocessable_content
    end
  end

  def update
    if @sample.update(sample_params)
      render json: @sample, status: :ok
    else
      render json: @sample.errors, status: :unprocessable_content
    end
  end

  def destroy
    @sample.destroy
    head :no_content
  end

  def sample_list
    samples = Sample.order(:id)

    render json: samples, status: :ok
  end

  def sample_list_with_pagination
    samples = Sample.order(:id).paginate(page: params[:page], per_page: 7)

    render json: {
      samples: samples,
      current_page: samples.current_page,
      total_pages: samples.total_pages
    },
    status: :ok
  end

  def sample_information
    sample = Sample.find(params[:id])

    render json: sample, status: :ok, methods: [:image_url]
  end

  private

    def set_maker
      @maker = Maker.find(params[:maker_id])
    end

    def set_sample
      @sample = @maker.samples.find(params[:id])
    end

    def sample_params
      params.require(:sample).permit(
        :name, :color, :hardness, :film_thickness, :feature, :image, :summary, :category_id
      )
    end
end
