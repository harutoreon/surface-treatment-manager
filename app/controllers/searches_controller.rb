class SearchesController < ApplicationController
  def search
    @samples = Sample.search(params[:search], params[:word])
  end

  def name_search
    @samples = Sample.name_search(params[:keyword])
  end

  def category_search
  end

  def maker_search
    @samples = Sample.maker_search(params[:keyword])
  end
end
