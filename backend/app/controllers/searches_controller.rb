class SearchesController < ApplicationController
  def name_search
    samples = Sample.name_search(params[:keyword])
    keyword = params[:keyword]

    render json: {
      samples: samples,
      keyword: keyword
    },
    status: :ok
  end

  def category_search
    category = Category.find_by(item: params[:keyword])
    samples = category.samples
    keyword = params[:keyword]

    render json: {
      samples: samples,
      keyword: keyword
    },
    status: :ok
  end

  def maker_search
    samples = Maker.maker_search(params[:keyword])
    keyword = params[:keyword]

    render json: {
      samples: samples,
      keyword: keyword
    },
    status: :ok
  end

  def list_search
    samples = Sample.with_image_url

    render json: samples, status: :ok
  end
end
