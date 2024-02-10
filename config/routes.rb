Rails.application.routes.draw do
  root "sessions#new"

  get    '/search', to: 'searches#search'
  get    '/signup', to: 'users#new'
  get    '/login',  to: 'sessions#new'
  post   '/login',  to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  get '/home',     to: 'static_pages#home'
  get '/name',     to: 'static_pages#name'
  get '/category', to: 'static_pages#category'
  get '/maker',    to: 'static_pages#maker'

  resources :samples
  resources :users
end
