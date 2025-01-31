require 'spec_helper'
require 'simplecov'

SimpleCov.start do
  add_filter '/spec/'
  add_filter '/config/'
  add_group 'Controllers', 'app/controllers'
  add_group 'Helpers',     'app/helpers'
  add_group 'Models',      'app/models'
end

ENV['RAILS_ENV'] ||= 'test'

require_relative '../config/environment'

abort("The Rails environment is running in production mode!") if Rails.env.production?

require 'rspec/rails'

Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
  config.after(:suite) do
    if Rails.env.test?
      FileUtils.rm_rf(Dir["#{Rails.root}/public/uploads_#{Rails.env}/"])
    end
  end
end
