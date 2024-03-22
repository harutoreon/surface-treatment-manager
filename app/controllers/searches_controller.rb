class SearchesController < ApplicationController
  def name_search
    @samples = Sample.name_search(params[:keyword])
  end

  def category_search
    @samples = Sample.category_search(params[:selectword])
    @search_string = params[:selectword]
  end

  def maker_search
    @samples = Sample.maker_search(params[:keyword])
    @search_string = params[:keyword]
  end
end
