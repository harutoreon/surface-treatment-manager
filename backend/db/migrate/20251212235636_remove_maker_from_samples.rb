class RemoveMakerFromSamples < ActiveRecord::Migration[7.2]
  def change
    remove_column :samples, :maker, :string
  end
end
