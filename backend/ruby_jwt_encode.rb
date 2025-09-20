require 'jwt'

payload = {
  user_id: 123,
  exp: Time.new.to_i * 3600
}

secret_key = 'your_secret_key_here'

token = JWT.encode(payload, secret_key, 'HS256')

puts token
# => "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMjMsImV4cCI6NjMyOTg5MzE1NDQwMH0.3tzbiuLU7sFWoNHoYm_S0C5EpAxHa0SU9BxYs5ShxYw"
