class DepartmentsController < ApplicationController
  before_action :set_department, only: [:show, :update, :destroy]

  def index
    departments = Department.order(:id)
    render json: departments, status: :ok
  end

  def show
    render json: @department, status: :ok
  end

  def create
    department = Department.new(department_params)

    if department.save
      render json: department, status: :created, location: department
    else
      render json: department.errors, status: :unprocessable_content
    end
  end

  def update
    if @department.update(department_params)
      render json: @department, status: :ok
    else
      render json: @department.errors, status: :unprocessable_content
    end
  end

  def destroy
    @department.destroy
    head :no_content
  end

  private

    def set_department
      @department = Department.find(params[:id])
    end
    def department_params
      params.require(:department).permit(:name)
    end
end
