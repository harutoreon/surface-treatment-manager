class MakersController < ApplicationController
  def show
    @maker = Maker.find(params[:id])
  end

  def new
    @maker = Maker.new
  end
end
