class SearchesController < ApplicationController
  before_action :set_keyword, only: %i[name_search category_search maker_search]

  def name_search
    samples = Sample.name_search(@keyword)
    render_samples(samples)
  end

  def category_search
    category = Category.find_by(item: @keyword)
    samples = category.samples
    render_samples(samples)
  end

  def maker_search
    samples = Maker.maker_search(@keyword)
    render_samples(samples)
  end

  def list_search
    samples = Sample.with_image_url

    render json: samples, status: :ok
  end

  private

    def set_keyword
      @keyword = params[:keyword]
    end

    def render_samples(samples)
      render json: {
        samples: samples,
        keyword: @keyword
      }, status: :ok
    end
end
