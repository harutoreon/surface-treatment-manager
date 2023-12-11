class AddPictureToSamples < ActiveRecord::Migration[7.1]
  def change
    add_column :samples, :picture, :string
  end
end
