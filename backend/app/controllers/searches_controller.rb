class SearchesController < ApplicationController
  def name_search
    samples = Sample.name_search(params[:keyword])
    keyword = params[:keyword]

    render json: {
      samples: samples,
      keyword: keyword
    }
  end

  def category_search
    samples = Sample.category_search(params[:keyword])
    keyword = params[:keyword]

    render json: {
      samples: samples,
      keyword: keyword
    }
  end

  def maker_search
    samples = Sample.maker_search(params[:keyword])
    keyword = params[:keyword]

    render json: {
      samples: samples,
      keyword: keyword
    }
  end
end
