import { mount } from '@vue/test-utils'
import LoginForm from '@/components/LoginForm.vue'
import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import router from '@/router'

const context = describe

vi.mock('axios')
vi.mock('@/router', () => ({
  default: {
    push: vi.fn()
  },
}))

describe('LoginForm.vue', () => {
  context ('有効な認証情報を入力した場合', () => {
    it('ログインに成功すること', async () => {
      const mockUser = { id: 1, name: 'test_user' }
      axios.post.mockResolvedValue({ data: { user: mockUser } })
      
      const wrapper = mount(LoginForm)
      const nameInput = wrapper.find('input[type="text"]')
      const passwordInput = wrapper.find('input[type="password"]')
      
      await nameInput.setValue('test_user')
      await passwordInput.setValue('password')
      
      await wrapper.find('form').trigger('submit.prevent')
      
      expect(wrapper.emitted('login-success')).toBeTruthy()
      expect(wrapper.emitted('login-success')[0]).toEqual([mockUser])
      expect(router.push).toHaveBeenCalledWith('/settings')
    })
  })

  context('無効な認証情報を入力した場合', () => {
    it('ログインに失敗すること', async () => {
      axios.post.mockRejectedValue(new Error('Invalid credentials'))
      
      const wrapper = mount(LoginForm)
      await wrapper.find('form').trigger('submit.prevent')
      
      expect(wrapper.text()).toContain('ユーザー名またはパスワードが無効です')
    })
  })
})
