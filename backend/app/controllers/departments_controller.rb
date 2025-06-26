class DepartmentsController < ApplicationController
  def index
    departments = Department.order(:id)

    render json: departments, status: :ok
  end

  def show
    department = Department.find(params[:id])

    render json: department, status: :ok
  end

  def create
    department = Department.new(department_params)

    if department.save
      render json: department, status: :created, location: department
    else
      render json: department.errors, status: :unprocessable_entity
    end
  end

  def update
    department = Department.find(params[:id])

    if department.update(department_params) 
      render json: department, status: :ok
    else
      render json: department.errors, status: :unprocessable_entity
    end
  end

  def destroy
    department = Department.find(params[:id])
    department.destroy

    head :no_content
  end

  private

    def department_params
      params.require(:department).permit(:name)
    end
end
