class AddSummaryToCategories < ActiveRecord::Migration[7.1]
  def change
    add_column :categories, :summary, :string
  end
end
