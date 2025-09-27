class JsonWebToken
  SECRET_KEY = Rails.application.secret_key_base

  def self.encode(payload)
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new decoded
  rescue JWT::DecodeError
    nil
  end
end
