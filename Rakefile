# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative "config/application"

Rails.application.load_tasks

if Rails.env.development?
  task(:default).clear
  task default: [:rubocop, :rspec, :rm]

  task :rubocop do
    sh 'bundle exec rubocop'
  end

  task :rspec do
    sh 'bundle exec rspec'
  end

  task :rm do
    sh 'rm -rf public/uploads/tmp'
  end
end
