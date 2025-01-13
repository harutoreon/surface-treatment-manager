# require 'rails_helper'

# RSpec.describe "LinksButtonFlow", type: :system do
#   describe 'samples/showページの', js: true do
#     before do
#       admin_user = FactoryBot.create(:admin_user)
#       log_in(admin_user)
#       @sample = FactoryBot.create(:sample)
#     end

#     context 'Linksボタンを押下した時' do
#       it 'aria-expanded属性がtrueであること' do
#         visit sample_path(@sample)
#         click_button('Links')
#         expect(page).to have_selector('button[aria-expanded="true"]')
#       end
#     end
#     context 'Linksボタンを押下しない時' do
#       it 'aria-expanded属性がfalseであること' do
#         visit sample_path(@sample)
#         expect(page).to have_selector('button[aria-expanded="false"]')
#       end
#     end
#   end
# end
