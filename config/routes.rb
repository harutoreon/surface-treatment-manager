Rails.application.routes.draw do
  root "users#new"

  get "/search", to: "searches#search"
  get '/signup', to: 'users#new'

  resources :samples
  resources :users
end
