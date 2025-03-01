import { mount } from '@vue/test-utils'
import UsersNewView from '@/components/UsersNewView.vue'
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

describe('UsersNewView', () => {
  let wrapper

  beforeEach(() => {
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
  })

  describe('コンポーネントのレンダリング', () => {
    it('見出し「ユーザー情報の登録」が表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('ユーザー情報の登録')
    })

    it('入力フォームが表示されること', () => {
      expect(wrapper.find('form').exists()).toBe(true)
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
      expect(wrapper.find('select').exists()).toBe(true)
      expect(wrapper.findAll('input[type="password"]').length).toBe(2)
    })

    it('RouterLinkのto属性が/usersであること', () => {
      expect(wrapper.find('a').attributes('href')).toBe('/users')
    })
  })

  describe('APIデータ取得後のレンダリング', () => {
    context('正しいユーザー情報を入力した場合', () => {
      it('ユーザー情報の登録に成功すること', async () => {
        const mockUser = {
          data: {
            name: 'sample user',
            department: '開発部',
            password: 'password',
            password_confirmation: 'password'
          }
        }
        axios.post.mockResolvedValue({ data: { user: mockUser } })

        const nameInput = wrapper.find('input[type="text"]')
        const departmentSelect = wrapper.find('select')
        const passwordInput = wrapper.find('input[type="password"][id="user_password"]')
        const passwordConfirmationInput = wrapper.find('input[type="password"][id="user_password_confirmation"]')

        await nameInput.setValue('sample user')
        await departmentSelect.setValue('開発部')
        await passwordInput.setValue('password')
        await passwordConfirmationInput.setValue('password')

        await wrapper.find('form').trigger('submit.prevent')

        expect(router.push).toHaveBeenCalledWith(`/users/${mockUser.id}`)
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
