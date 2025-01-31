Rails.application.routes.draw do
  root 'home#index'

  post   '/login',  to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  resources :categories
  resources :makers
  resources :users

  resources :samples do
    resources :comments
  end
end
