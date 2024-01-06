Rails.application.routes.draw do
  root "static_pages#home"

  resources :samples

  get "/search", to: "searches#search"
  get '/signup', to: 'users#new'
end
