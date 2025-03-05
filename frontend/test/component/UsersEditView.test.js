import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import UsersEditView from '@/components/UsersEditView.vue'

describe('UsersEditView', () => {
  describe('コンポーネントがレンダリングされたとき', () => {
    it('見出し「ユーザー情報の編集」が表示されること', () => {
      const wrapper = mount(UsersEditView)

      expect(wrapper.find('h3').text()).toBe('ユーザー情報の編集')
    })

    it('入力フォームが表示されること', ()  => {
      const wrapper = mount(UsersEditView)

      expect(wrapper.find('label[for="user_name"]').text()).toBe('ユーザー名')
      expect(wrapper.find('input[id="user_name"]').exists()).toBe(true)

      expect(wrapper.find('label[for="user_department"]').text()).toBe('部署名')
      expect(wrapper.find('select[id="user_department"]').exists()).toBe(true)

      expect(wrapper.find('label[for="user_password"]').text()).toBe('パスワード')
      expect(wrapper.find('input[id="user_password"]').exists()).toBe(true)

      expect(wrapper.find('label[for="user_password_confirmation"]').text()).toBe('パスワードの確認')
      expect(wrapper.find('input[id="user_password_confirmation"]').exists()).toBe(true)
      
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('「ユーザー情報」と「ユーザーリスト」のリンクが表示されること', () => {
      const wrapper = mount(UsersEditView)

      expect(wrapper.find('routerlink[id="user_information"]').text()).toBe('ユーザー情報')
      expect(wrapper.find('routerlink[id="user_list"]').text()).toBe('ユーザーリスト')
    })
  })
})
