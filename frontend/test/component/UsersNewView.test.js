import { mount } from '@vue/test-utils'
import UsersNewView from '@/components/UsersNewView.vue'
import { describe, it, expect, beforeEach } from 'vitest'

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
})
