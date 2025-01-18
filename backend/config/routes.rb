Rails.application.routes.draw do
  resources :categories
  resources :makers
  resources :users

  resources :samples do
    resources :comments
  end
end
