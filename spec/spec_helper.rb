RSpec.configure do |config|
  config.default_formatter = "documentation"
  config.order = :random
  config.disable_monkey_patching!
  Kernel.srand config.seed
end
