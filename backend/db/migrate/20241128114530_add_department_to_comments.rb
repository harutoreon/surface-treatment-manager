class AddDepartmentToComments < ActiveRecord::Migration[7.2]
  def change
    add_column :comments, :department, :string
  end
end
