class SearchesController < ApplicationController
  def name_search
    @samples = Sample.name_search(params[:keyword]).paginate(page: params[:page], per_page: 8)
    @keyword = params[:keyword]
  end

  def category_search
    @samples = Sample.category_search(params[:selectword]).paginate(page: params[:page], per_page: 8)
    @selectword = params[:selectword]
  end

  def maker_search
    @samples = Sample.maker_search(params[:keyword]).paginate(page: params[:page], per_page: 8)
  end
end
