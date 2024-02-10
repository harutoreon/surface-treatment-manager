class SearchesController < ApplicationController
  def search
    @samples = Sample.search(params[:search], params[:word])
  end

  def name_search
  end

  def category_search
  end

  def maker_search
  end
end
