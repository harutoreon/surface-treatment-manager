class AddSummaryToSamples < ActiveRecord::Migration[7.2]
  def change
    add_column :samples, :summary, :string
  end
end
