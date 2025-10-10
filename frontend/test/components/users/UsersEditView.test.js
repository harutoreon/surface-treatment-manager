import UsersEditView from '@/components/users/UsersEditView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('ユーザー情報の編集ページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({  // fetchUserInformation()
          data: {
            id: 1,
            name: '渡辺 陸斗',
            department: '開発部'
          }
        })

      wrapper = mount(UsersEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('ユーザー情報の編集')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({  // checkLoginStatus()
        response: {
          status: 401
        }
      })

      wrapper = mount(UsersEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'ログインが必要です。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            name: '渡辺 陸斗',
            department: '開発部'
          }
        })

      wrapper = mount(UsersEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', async () => {
      expect(wrapper.find('h3').text()).toBe('ユーザー情報の編集')
    })

    it('入力フォームが表示されること', async ()  => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="user-name"]').text()).toBe('ユーザー名')
      expect(wrapper.find('label[for="user-department"]').text()).toBe('部署名')
      expect(wrapper.find('label[for="user-password"]').text()).toBe('パスワード')
      expect(wrapper.find('label[for="user-password-confirmation"]').text()).toBe('パスワードの確認')

      // 入力要素と値
      expect(wrapper.find('#user-name').element.value).toBe('渡辺 陸斗')
      expect(wrapper.find('#user-department').element.value).toBe('開発部')
      expect(wrapper.find('#user-password').exists()).toBe(true)
      expect(wrapper.find('#user-password-confirmation').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('更新')
    })

    it('外部リンクが表示されること', async () => {
      const routerLinks = wrapper.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/users/1')
      expect(routerLinks[1].props().to).toBe('/users')

      // テキスト
      expect(routerLinks[0].text()).toBe('ユーザー情報')
      expect(routerLinks[1].text()).toBe('ユーザーリスト')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      axios.get
        .mockResolvedValue({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockRejectedValue({
          response: {
            status: 404
          }
        })

      wrapper = mount(UsersEditView, {
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
    it('ユーザー情報ページに遷移すること', async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            name: '渡辺 陸斗',
            department: '開発部'
          }
        })

      axios.patch.mockResolvedValue({
        data: {
          id: 1,
          name: '伊藤 美月',
          department: '開発部'
        }
      })

      wrapper = mount(UsersEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

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
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({
          data: {
            id: 1,
            name: '渡辺 陸斗',
            department: '開発部'
          }
        })

      axios.patch.mockRejectedValue({
        response: {
          status: 422
        }
      })

      wrapper = mount(UsersEditView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      await wrapper.find('#user-name').setValue('')
      await wrapper.find('button').trigger('submit.prevent')
      
      expect(wrapper.text()).toContain('入力に不備があります。')
    })
  })
})
