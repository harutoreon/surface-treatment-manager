class AddFieldsToSamples < ActiveRecord::Migration[7.1]
  def change
    add_column :samples, :hardness, :string
    add_column :samples, :film_thickness, :string
    add_column :samples, :feature, :string
  end
end
