import { mount } from '@vue/test-utils'
import LoginView from '@/components/sessions/LoginView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

const context = describe
const pushMock = vi.fn()

vi.mock('axios')

vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('LoginForm.vue', () => {
  context('有効な認証情報を入力した場合', () => {
    it('ログインに成功すること', async () => {
      const mockUser = { id: 1, name: 'test_user' }
      axios.post.mockResolvedValue({ data: { user: mockUser } })
      
      const wrapper = mount(LoginView)
      const nameInput = wrapper.find('#user-name')
      const passwordInput = wrapper.find('#user-password')
      
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

      expect(pushMock).toHaveBeenCalledWith('/home')
    })
  })

  context('無効な認証情報を入力した場合', () => {
    it('ログインに失敗すること', async () => {
      axios.post.mockRejectedValue(new Error('Invalid credentials'))
      
      const wrapper = mount(LoginView)
      await wrapper.find('form').trigger('submit.prevent')
      
      expect(wrapper.text()).toContain('ユーザー名またはパスワードが無効です')
    })
  })

  describe('値のバインディング', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LoginView)
    })

    describe('管理者ユーザーのラジオボンタンを押した場合', () => {
      it('管理者ユーザーの認証情報が入力フォームにセットされること', async () => {
        await wrapper.find('#admin-user').trigger('change')

        expect(wrapper.find('#user-name').element.value).toBe('admin user')
        expect(wrapper.find('#user-password').element.value).toBe('adminpassword')
      })
    })

    describe('一般ユーザーのラジオボンタンを押した場合', () => {
      it('一般ユーザーの認証情報が入力フォームにセットされること', async () => {
        await wrapper.find('#general-user').trigger('change')

        expect(wrapper.find('#user-name').element.value).toBe('general user')
        expect(wrapper.find('#user-password').element.value).toBe('generalpassword')
      })
    })
  })
})
