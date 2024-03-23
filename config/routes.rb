Rails.application.routes.draw do
  root "sessions#new"

  get    '/login',  to: 'sessions#new'
  post   '/login',  to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  get '/home',              to: 'static_pages#home'
  get '/category/name',     to: 'static_pages#name'
  get '/category/category', to: 'static_pages#category'
  get '/category/maker',    to: 'static_pages#maker'

  get '/category/name/search',     to: 'searches#name_search'
  get '/category/category/search', to: 'searches#category_search'
  get '/category/maker/search',    to: 'searches#maker_search'

  get '/setting', to: 'settings#home'

  resources :samples
  resources :users
  resources :categories
end
