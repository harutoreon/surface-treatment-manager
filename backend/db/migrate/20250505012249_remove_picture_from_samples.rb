class RemovePictureFromSamples < ActiveRecord::Migration[7.2]
  def change
    remove_column :samples, :picture, :string
  end
end
