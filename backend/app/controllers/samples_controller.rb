class SamplesController < ApplicationController
  def index
    maker = Maker.find(params[:maker_id])
    samples = maker.samples.order(:id).paginate(page: params[:page], per_page: 7)

    render json: {
      samples: samples,
      current_page: samples.current_page,
      total_pages: samples.total_pages
    },
    status: :ok
  end

  def show
    maker = Maker.find(params[:maker_id])
    sample = maker.samples.find(params[:id])

    render json: sample, status: :ok, methods: [:image_url]
  end

  def create
    maker = Maker.find(params[:maker_id])
    sample = maker.samples.build(sample_params)

    if sample.save
      render json: sample, status: :created, location: maker_sample_url(maker, sample)
    else
      render json: sample.errors, status: :unprocessable_content
    end
  end

  def update
    maker = Maker.find(params[:maker_id])
    sample = maker.samples.find(params[:id])

    if sample.update(sample_params)
      render json: sample, status: :ok
    else
      render json: sample.errors, status: :unprocessable_content
    end
  end

  def destroy
    maker = Maker.find(params[:maker_id])
    sample = maker.samples.find(params[:id])
    sample.destroy
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

    def sample_params
      params.require(:sample).permit(
        :name, :category, :color, :hardness, :film_thickness, :feature, :image, :summary
      )
    end
end
