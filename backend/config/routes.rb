Rails.application.routes.draw do
  root 'home#index'

  resources :categories
  resources :makers
  resources :users

  resources :samples do
    resources :comments
  end
end
