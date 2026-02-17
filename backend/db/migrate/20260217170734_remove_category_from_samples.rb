class RemoveCategoryFromSamples < ActiveRecord::Migration[8.0]
  def change
    remove_column :samples, :category, :string
  end
end
