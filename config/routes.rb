Rails.application.routes.draw do
  root "sessions#new"

  get    '/search', to: 'searches#search'
  get    '/signup', to: 'users#new'
  get    '/login',  to: 'sessions#new'
  post   '/login',  to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  resources :samples
  resources :users
end
