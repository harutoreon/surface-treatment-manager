class SamplesController < ApplicationController
  def show
    @sample = Sample.find(params[:id])
  end

  def new
    @sample = Sample.new
  end
end
