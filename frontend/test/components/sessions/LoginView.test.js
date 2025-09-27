import LoginView from '@/components/sessions/LoginView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import axios from 'axios'

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

describe('LoginForm', () => {
  let wrapper

  describe('初期レンダリング', () => {
    beforeEach(async () => {
      wrapper = mount(LoginView)

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('ログイン')
    })

    it('ユーザー選択のラジオボタンが表示されること', () => {
      // 入力要素
      expect(wrapper.find('#general-user').attributes('type')).toBe('radio')
      expect(wrapper.find('#admin-user').attributes('type')).toBe('radio')

      // ラベル要素
      expect(wrapper.find('label[for="general-user"]').text()).toBe('一般ユーザー')
      expect(wrapper.find('label[for="admin-user"]').text()).toBe('管理者ユーザー')

      // 説明
      expect(wrapper.text()).toContain('一部の機能は制限されます。')
      expect(wrapper.text()).toContain('すべての機能が利用できます。')
    })

    it('入力フォームが表示されること', () => {
      // ラベル要素
      expect(wrapper.find('label[for="user-name"]').text()).toBe('ユーザー名')
      expect(wrapper.find('label[for="user-password"]').text()).toBe('パスワード')

      // 入力要素
      expect(wrapper.find('#user-name').exists()).toBe(true)
      expect(wrapper.find('#user-password').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('ログイン')
    })
  })

  describe('ログインフロー', () => {
    describe('有効な認証情報を入力した場合', () => {
      it('ログインに成功すること', async () => {
        axios.post.mockResolvedValue({
          data: {
            id: 1,
            name: 'general user',
            password: 'password'
          }
        })
        
        const wrapper = mount(LoginView)

        await flushPromises()

        await wrapper.find('#user-name').setValue('general user')
        await wrapper.find('#user-password').setValue('password')
        
        await wrapper.find('form').trigger('submit.prevent')

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

    describe('無効な認証情報を入力した場合', () => {
      it('ログインに失敗すること', async () => {
        axios.post.mockRejectedValue({
          response: {
            status: 422
          }
        })
        
        wrapper = mount(LoginView)

        await flushPromises()

        await wrapper.find('#user-name').setValue('')
        await wrapper.find('#user-password').setValue('password')

        await wrapper.find('form').trigger('submit.prevent')
        
        expect(wrapper.text()).toContain('ユーザー名またはパスワードが無効です')
      })
    })
  })

  describe('ユーザーの選択', () => {
    beforeEach(async () => {
      wrapper = mount(LoginView)

      await flushPromises()
    })

    describe('一般ユーザーを選択した場合', () => {
      it('一般ユーザーの認証情報が入力フォームにセットされること', async () => {
        await wrapper.find('#general-user').trigger('change')

        expect(wrapper.find('#user-name').element.value).toBe('general user')
        expect(wrapper.find('#user-password').element.value).toBe('generalpassword')
      })
    })

    describe('管理者ユーザーを選択した場合', () => {
      it('管理者ユーザーの認証情報が入力フォームにセットされること', async () => {
        await wrapper.find('#admin-user').trigger('change')

        expect(wrapper.find('#user-name').element.value).toBe('admin user')
        expect(wrapper.find('#user-password').element.value).toBe('adminpassword')
      })
    })
  })
})
