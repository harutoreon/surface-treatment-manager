require 'rails_helper'
require 'json_web_token'

RSpec.describe JsonWebToken do
  describe '.encode' do
    it '文字列クラスのトークンにエンコードされること' do
      payload = { user_id: 1 }
      token = JsonWebToken.encode(payload)

      expect(token).to be_a(String)
    end
  end
  
  describe '.decode' do
    it 'user_id にデコードされること' do
      payload = { user_id: 1 }
      token = JsonWebToken.encode(payload)
      decoded = JsonWebToken.decode(token)

      expect(decoded[:user_id]).to eq(1)
    end

    it '無効なトークンは nil が返ること' do
      invalid_token = 'invalid token'
      decoded = JsonWebToken.decode(invalid_token)

      expect(decoded).to be_nil
    end
  end
end
