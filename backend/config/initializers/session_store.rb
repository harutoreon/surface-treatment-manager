# config/initializers/session_store.rb
Rails.application.config.session_store :cookie_store,
  key: '_surface_treatment_manager_session',
  same_site: :none,
  # secure: true
  secure: Rails.env.production?

# セッション設定をログに出力する
# Rails.logger.info "=== Session options: #{Rails.application.config.session_options.inspect} ==="
