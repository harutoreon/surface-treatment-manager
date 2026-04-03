import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLogin } from '@/composables/useLogin.js'
import axios from 'axios'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))

vi.mock('axios')

describe('useLogin', () => {
  describe('changeToAdminUserData', () => {
    it('実行するとnameとpasswordが返ること', () => {
      const { name, password, changeToAdminUserData } = useLogin()
      changeToAdminUserData()

      expect(name.value).toBe('admin user')
      expect(password.value).toBe('adminpassword')
    })
  })

  describe('changeToGeneralUserData', () => {
    it('実行するとnameとpasswordが返ること', () => {
      const { name, password, changeToGeneralUserData } = useLogin()
      changeToGeneralUserData()

      expect(name.value).toBe('general user')
      expect(password.value).toBe('generalpassword')
    })
  })

  describe('handleLogin', () => {
    let emitMock

    beforeEach(() => {
      emitMock = vi.fn()
      vi.clearAllMocks()
      localStorage.clear()
    })

    it('実行に成功すると /home に移動すること', async () => {
      axios.post.mockResolvedValue({ data: { token: 'fake-token' } })

      const { name, password, handleLogin } = useLogin(emitMock)

      name.value = 'admin user'
      password.value = 'adminpassword'

      await handleLogin()

      expect(localStorage.getItem('token')).toBe('fake-token')
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        name: 'admin user',
        password: 'adminpassword'
      })
      expect(emitMock).toHaveBeenCalledWith('message', {
        type: 'success',
        text: 'ログインしました。'
      })
      expect(pushMock).toHaveBeenCalledWith('/home')
    })

    it('実行に失敗するとエラーメッセージが表示されること', async () => {
      axios.post.mockRejectedValue(new Error('Login Failed'))

      const { errorMessage, handleLogin } = useLogin(emitMock)

      await handleLogin()

      expect(errorMessage.value).toBe('ユーザー名またはパスワードが無効です')
      expect(pushMock).not.toHaveBeenCalled()
    })
  })
})