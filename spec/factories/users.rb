FactoryBot.define do
  factory :user, class: User do
    name                  { "Michael Hartl" }
    department            { "品質管理部" }
    password              { "foobar" }
    password_confirmation { "foobar" }
    admin                 { true }
  end

  factory :michael, class: User do
    name                  { "Michael Example" }
    department            { "品質管理部" }
    password              { 'password' }
    password_confirmation { 'password' }
  end

  factory :archer, class: User do
    name                  { "Sterling Archer" }
    department            { "品質管理部" }
    password              { "password" }
    password_confirmation { "password" }
  end

  factory :admin, class: User do
    name                  { "admin user" }
    department            { "品質管理部" }
    password              { "password" }
    password_confirmation { "password" }
    admin                 { true }
  end

  factory :non_admin, class: User do
    name                  { "non admin user" }
    department            { "品質管理部" }
    password              { "password" }
    password_confirmation { "password" }
  end

  factory :admin_user, class: User do
    name                  { 'admin user' }
    department            { "品質管理部" }
    password              { 'adminpassword' }
    password_confirmation { 'adminpassword' }
    admin                 { true }
  end

  factory :general_user, class: User do
    name                    { 'general user' }
    department              { "品質管理部" }
    password                { 'generalpassword' }
    password_confirmation   { 'generalpassword' }
  end

  factory :sample_user, class: User do
    name                    { 'sample user' }
    department              { "品質管理部" }
    password                { 'password' }
    password_confirmation   { 'password' }
  end

  factory :user_list, class: User do
    name                    { Faker::Name.name }
    department              { ["品質管理部", "製造部", "開発部", "営業部"].sample }
    password                { 'password' }
    password_confirmation   { 'password' }
  end
end
