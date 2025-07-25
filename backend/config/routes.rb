Rails.application.routes.draw do
  root 'home#index'

  post   '/login',     to: 'sessions#create'
  delete '/logout',    to: 'sessions#destroy'
  get    '/logged_in', to: 'sessions#logged_in?'

  get '/name_search',     to: 'searches#name_search'
  get '/category_search', to: 'searches#category_search'
  get '/maker_search',    to: 'searches#maker_search'
  get '/list_search',     to: 'searches#list_search'

  resources :categories
  resources :makers
  resources :users
  resources :departments

  resources :samples do
    resources :comments
  end
end
