class CreateSamples < ActiveRecord::Migration[7.1]
  def change
    create_table :samples do |t|
      t.string :name
      t.string :category
      t.string :color
      t.string :maker

      t.timestamps
    end
  end
end
