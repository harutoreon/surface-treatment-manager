Rails.application.routes.draw do
  root 'home#index'

  post   '/login',     to: 'sessions#create'
  delete '/logout',    to: 'sessions#destroy'
  get    '/logged_in', to: 'sessions#logged_in'

  get '/name_search',     to: 'searches#name_search'
  get '/category_search', to: 'searches#category_search'
  get '/maker_search',    to: 'searches#maker_search'
  get '/list_search',     to: 'searches#list_search'

  get '/comments', to: 'comments#comment_list'
  get '/comments/:id', to: 'comments#comment_information'
  
  get '/sample_list', to: 'samples#sample_list'
  
  resources :categories
  resources :makers
  resources :users
  resources :departments

  resources :samples do
    resources :comments
  end

  get "/debug_session", to: ->(env) {
    [200, { "Content-Type" => "application/json" }, [ Rails.application.config.session_options.to_json ]]
  }
end
