Rails.application.routes.draw do
  get 'searchs/search'
  root "static_pages#home"

  resources :samples
end
