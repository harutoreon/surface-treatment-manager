import { mount } from '@vue/test-utils'
import LoginForm from '@/components/LoginForm.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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

      expect(wrapper.emitted('message')).toBeTruthy
      expect(wrapper.emitted('message')[0]).toEqual([
        {
          type: 'success',
          text: 'ログインしました。'
        }
      ])

      expect(router.push).toHaveBeenCalledWith('/home')
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

  describe('値のバインディング', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LoginForm)
    })

    describe('管理者ユーザーのラジオボンタンを押した場合', () => {
      it('管理者ユーザーの認証情報が入力フォームにセットされること', async () => {
        await wrapper.find('#admin_user').trigger('change')

        expect(wrapper.find('#user_name').element.value).toBe('admin user')
        expect(wrapper.find('#password').element.value).toBe('adminpassword')
      })
    })

    describe('一般ユーザーのラジオボンタンを押した場合', () => {
      it('一般ユーザーの認証情報が入力フォームにセットされること', async () => {
        await wrapper.find('#general_user').trigger('change')

        expect(wrapper.find('#user_name').element.value).toBe('general user')
        expect(wrapper.find('#password').element.value).toBe('generalpassword')
      })
    })
  })
})
