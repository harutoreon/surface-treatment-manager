class HomeController < ApplicationController
  def index
    render json: { message: "API Root" }, status: :ok
  end
end
