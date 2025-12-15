class AddMakerToSamples < ActiveRecord::Migration[7.2]
  def change
    add_reference :samples, :maker, null: false, foreign_key: true
  end
end
