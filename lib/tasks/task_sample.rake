desc 'Automated code analysis and test execution'
task :rspec_test do
  sh 'bundle exec rubocop'
  sh 'bundle exec rspec'
  sh 'rm -rf public/uploads/tmp'
end
