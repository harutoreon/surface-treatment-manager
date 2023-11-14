class SamplesController < ApplicationController
  def show
    @sample = Sample.find(params[:id])
  end
end
