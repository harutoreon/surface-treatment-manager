FactoryBot.define do
  factory :user, class: User do
    name                  { "Michael Hartl" }
    password              { "foobar" }
    password_confirmation { "foobar" }
    admin { true }
  end

  factory :michael, class: User do
    name { "Michael Example" }
    password              { 'password' }
    password_confirmation { 'password' }
  end

  factory :archer, class: User do
    name                  { "Sterling Archer" }
    password              { "password" }
    password_confirmation { "password" }
  end

  factory :admin, class: User do
    name                  { "admin user" }
    password              { "password" }
    password_confirmation { "password" }
    admin { true }
  end

  factory :non_admin, class: User do
    name                  { "non admin user" }
    password              { "password" }
    password_confirmation { "password" }
  end
end
