FactoryBot.define do
  factory :user, class: User do
    name                  { "Michael Hartl" }
    password              { "foobar" }
    password_confirmation { "foobar" }
  end

  factory :michael, class: User do
    name { "Michael Example" }
    password              { 'password' }
    password_confirmation { 'password' }
  end
end
