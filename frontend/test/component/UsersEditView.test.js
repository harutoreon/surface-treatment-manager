import UsersEditView from '@/components/UsersEditView.vue'
import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()
const pushMock = vi.fn()

vi.mock('axios')

vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: 1 }
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock
      }
    }
  }
})

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

  describe('API通信', () => {
    describe('ユーザー情報の取得に成功した場合', () => {
      it('ユーザー名と部署名が表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            id: 1,
            name: 'test user',
            department: '開発部'
          }
        })

        const wrapper = mount(UsersEditView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('#user_name').element.value).toBe('test user')
        expect(wrapper.find('#user_department').element.value).toBe('開発部')
      })
    })

    describe('ユーザー情報の取得に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(UsersEditView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'danger', text: 'ユーザー情報の取得に失敗しました。' }
        ])
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })

    describe('ユーザー情報の更新に成功した場合', () => {
      it('更新成功のメッセージが表示されユーザー情報のページに遷移すること', async () => {
        axios.get.mockResolvedValue({
          data: {
            id: 1,
            name: 'test user',
            department: '開発部'
          }
        })

        axios.patch.mockResolvedValue({
          data: {
            id: 1,
            name: 'update test user',
            department: '開発部'
          }
        })

        const wrapper = mount(UsersEditView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('#user_name').element.value).toBe('test user')
        expect(wrapper.find('#user_department').element.value).toBe('開発部')

        await wrapper.find('#user_name').setValue('update test user')
        await wrapper.find('button').trigger('submit.prevent')

        expect(wrapper.emitted()).toHaveProperty('message')
        expect(wrapper.emitted().message[0]).toEqual([
          { type: 'success', text: 'ユーザー情報を更新しました。' }
        ])
        expect(pushMock).toHaveBeenCalledWith('/users/1')
      })
    })

    describe('ユーザー情報の更新に失敗した場合', () => {
      it('入力不備のメッセージが表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            id: 1,
            name: 'test user',
            department: '開発部'
          }
        })

        axios.patch.mockRejectedValue(new Error('Validation error'))

        const wrapper = mount(UsersEditView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('#user_name').element.value).toBe('test user')
        expect(wrapper.find('#user_department').element.value).toBe('開発部')

        await wrapper.find('#user_name').setValue('')
        await wrapper.find('button').trigger('submit.prevent')
        
        expect(wrapper.text()).toContain('入力に不備があります。')
      })
    })
  })
})
