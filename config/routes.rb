Rails.application.routes.draw do
  root "static_pages#home"

  get "/search", to: "searches#search"
  get '/signup', to: 'users#new'

  resources :samples
  resources :users
end
