class CreateMakers < ActiveRecord::Migration[7.1]
  def change
    create_table :makers do |t|
      t.string :name
      t.string :postal_code
      t.string :address
      t.string :phone_number
      t.string :fax_number
      t.string :email
      t.string :home_page
      t.string :manufacturer_rep

      t.timestamps
    end
  end
end
