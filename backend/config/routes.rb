Rails.application.routes.draw do
  root 'home#index'

  post   '/login',     to: 'sessions#create'
  delete '/logout',    to: 'sessions#destroy'
  get    '/logged_in', to: 'sessions#logged_in?'

  resources :categories
  resources :makers
  resources :users

  resources :samples do
    resources :comments
  end
end
