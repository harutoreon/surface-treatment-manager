class SearchesController < ApplicationController
  def search
    @samples = Sample.search(params[:search], params[:word])
  end
end
