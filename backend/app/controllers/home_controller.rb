class HomeController < ApplicationController
  def index
    render json: { message: "API Root" }
  end
end
