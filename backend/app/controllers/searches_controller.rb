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

  def film_thickness_search
    samples = Sample.film_thickness_search(min_film_thickness, max_film_thickness)
    render json: samples, status: :ok
  end

  private

    def set_keyword
      @keyword = params[:keyword]
    end

    def min_film_thickness
      params[:min_film_thickness].to_i
    end

    def max_film_thickness
      params[:max_film_thickness].to_i
    end

    def render_samples(samples)
      render json: {
        samples: samples,
        keyword: @keyword
      }, status: :ok
    end
end
