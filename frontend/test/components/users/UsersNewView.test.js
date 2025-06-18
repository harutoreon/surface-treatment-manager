import { flushPromises, mount } from '@vue/test-utils'
import UsersNewView from '@/components/users/UsersNewView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

const context = describe

vi.mock('axios')

const pushMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('UsersNewView', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(UsersNewView, {
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>'
          }
        }
      }
    })

    await flushPromises()
  })

  describe('コンポーネントのレンダリング', () => {
    it('見出し「ユーザー情報の登録」が表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('ユーザー情報の登録')
    })

    it('入力フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="user-name"]').text()).toBe('ユーザー名')
      expect(wrapper.find('label[for="user-department"]').text()).toBe('部署名')
      expect(wrapper.find('label[for="user-password"]').text()).toBe('パスワード')
      expect(wrapper.find('label[for="user-password-confirmation"]').text()).toBe('パスワードの確認')

      // 入力要素・選択要素
      expect(wrapper.find('#user-name').exists()).toBe(true)
      expect(wrapper.find('#user-department').exists()).toBe(true)
      expect(wrapper.find('#user-password').exists()).toBe(true)
      expect(wrapper.find('#user-password-confirmation').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('登録')
    })

    it('RouterLinkにto属性が設定されていること', () => {
      expect(wrapper.findComponent({ ref: 'linkUsersNew' }).props().to).toBe('/users')
    })
  })

  describe('APIデータ取得後のレンダリング', () => {
    context('正しいユーザー情報を入力した場合', () => {
      it('ユーザー情報の登録に成功すること', async () => {
        const mockUser = {
          data: {
            id: 1,
            name: 'sample user',
            department: '開発部',
            password: 'password',
            password_confirmation: 'password'
          }
        }
        axios.post.mockResolvedValue({ data: { user: mockUser } })

        const nameInput = wrapper.find('#user-name')
        const departmentSelect = wrapper.find('#user-department')
        const passwordInput = wrapper.find('#user-password')
        const passwordConfirmationInput = wrapper.find('#user-password-confirmation')

        await nameInput.setValue('sample user')
        await departmentSelect.setValue('開発部')
        await passwordInput.setValue('password')
        await passwordConfirmationInput.setValue('password')

        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'success', text: 'ユーザー情報を登録しました。' }
        ])
        expect(pushMock).toHaveBeenCalledWith(`/users/${mockUser.id}`)
      })
    })

    context('誤ったユーザー情報を入力した場合', () => {
      it('ユーザー情報の登録に失敗すること', async () => {
        axios.post.mockRejectedValue(new Error('Invalid credentials'))

        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.text()).toContain('入力に不備があります。')
      })
    })
  })
})
