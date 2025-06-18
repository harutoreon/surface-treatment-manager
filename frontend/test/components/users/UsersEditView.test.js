import UsersEditView from '@/components/users/UsersEditView.vue'
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
    it('見出し「ユーザー情報の編集」が表示されること', async () => {
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

      expect(wrapper.find('h3').text()).toBe('ユーザー情報の編集')
    })

    it('入力フォームが表示されること', async ()  => {
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

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="user-name"]').text()).toBe('ユーザー名')
      expect(wrapper.find('label[for="user-department"]').text()).toBe('部署名')
      expect(wrapper.find('label[for="user-password"]').text()).toBe('パスワード')
      expect(wrapper.find('label[for="user-password-confirmation"]').text()).toBe('パスワードの確認')

      // 入力要素
      expect(wrapper.find('#user-name').exists()).toBe(true)
      expect(wrapper.find('#user-department').exists()).toBe(true)
      expect(wrapper.find('#user-password').exists()).toBe(true)
      expect(wrapper.find('#user-password-confirmation').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('更新')
    })

    it('外部リンクが表示されること', async () => {
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

      expect(wrapper.findComponent({ ref: 'linkUsersShow' }).props().to).toBe('/users/1')
      expect(wrapper.findComponent({ ref: 'linkUsersShow' }).text()).toBe('ユーザー情報')
      expect(wrapper.findComponent({ ref: 'linkUsers' }).props().to).toBe('/users')
      expect(wrapper.findComponent({ ref: 'linkUsers' }).text()).toBe('ユーザーリスト')
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

        expect(wrapper.find('#user-name').element.value).toBe('test user')
        expect(wrapper.find('#user-department').element.value).toBe('開発部')
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

        expect(wrapper.find('#user-name').element.value).toBe('test user')
        expect(wrapper.find('#user-department').element.value).toBe('開発部')

        await wrapper.find('#user-name').setValue('update test user')
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

        expect(wrapper.find('#user-name').element.value).toBe('test user')
        expect(wrapper.find('#user-department').element.value).toBe('開発部')

        await wrapper.find('#user-name').setValue('')
        await wrapper.find('button').trigger('submit.prevent')
        
        expect(wrapper.text()).toContain('入力に不備があります。')
      })
    })
  })
})
