desc 'Automated code analysis and test execution'
task :rspec_test do
  if Rails.env.development?
    sh 'bundle exec rubocop'
    sh 'bundle exec brakeman -q -w2'
    sh 'RUBYOPT=-W:deprecated bundle exec rspec'
    sh 'rm -rf public/uploads/tmp'
  end
end
