require 'jwt'

token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMjMsImV4cCI6NjMyOTg5MzE1NDQwMH0.3tzbiuLU7sFWoNHoYm_S0C5EpAxHa0SU9BxYs5ShxYw'
secret_key = 'your_secret_key_here'

decoded_token = JWT.decode(token, secret_key, true, algorithm: 'HS256')
payload = decoded_token[0]
header = decoded_token[1]

puts "Payload: #{payload}"
# => Payload: {"user_id"=>123, "exp"=>6329893154400}

puts "Header: #{header}"
# => Header: {"alg"=>"HS256"}
