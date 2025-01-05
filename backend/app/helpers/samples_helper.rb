module SamplesHelper
  def select_word
    Category.all.map { |category| category.item }
  end
end
