FactoryBot.define do
  factory :user do
    name                  { "Michael Hartl" }
    password              { "foobar" }
    password_confirmation { "foobar" }
  end
end
