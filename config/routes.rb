Rails.application.routes.draw do
  root "sessions#new"

  get    '/signup', to: 'users#new'
  get    '/login',  to: 'sessions#new'
  post   '/login',  to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  get '/home',     to: 'static_pages#home'
  get '/name',     to: 'static_pages#name'
  get '/category', to: 'static_pages#category'
  get '/maker',    to: 'static_pages#maker'

  get '/name/search',     to: 'searches#name_search'
  get '/category/search', to: 'searches#category_search'
  get '/maker/search',    to: 'searches#maker_search'

  resources :samples
  resources :users
end
