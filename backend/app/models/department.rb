class Department < ApplicationRecord
  validates :name, presence:   { message: '部署名が空白です。' },
                   uniqueness: { message: '部署名が重複しています。' }
end
