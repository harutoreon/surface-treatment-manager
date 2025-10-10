import UsersNewView from '@/components/users/UsersNewView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const pushMock = vi.fn()
const replaceMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock,
        replace: replaceMock
      }
    }
  }
})

describe('UsersNewView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('ユーザー情報の登録ページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({  // fetchDepartments()
          response: {
            status: 200
          }
        })

      wrapper = mount(UsersNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('ユーザー情報の登録')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValue({  // checkLoginStatus()
        response: {
          status: 401
        }
      })

      wrapper = mount(UsersNewView, {
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

  describe('初期レンダリング', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '品質管理部' },
            { id: 2, name: '製造部' },
            { id: 3, name: '開発部' },
            { id: 4, name: '営業部' }
          ]
        })

      wrapper = mount(UsersNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
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

      // 入力要素
      expect(wrapper.find('#user-name').exists()).toBe(true)
      expect(wrapper.find('#user-password').exists()).toBe(true)
      expect(wrapper.find('#user-password-confirmation').exists()).toBe(true)

      // 選択要素
      expect(wrapper.find('#user-department').exists()).toBe(true)
      expect(wrapper.find('option[value="品質管理部"]').exists()).toBe(true)
      expect(wrapper.find('option[value="製造部"]').exists()).toBe(true)
      expect(wrapper.find('option[value="開発部"]').exists()).toBe(true)
      expect(wrapper.find('option[value="営業部"]').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('登録')
    })

    it('外部リンクが表示されること', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/users')
      expect(routerLink.text()).toBe('ユーザーリスト')
    })
  })

  describe('部署名リストの取得に成功した場合', () => {
    it('オプション要素に部署名がセットされること', async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '品質管理部' },
            { id: 2, name: '製造部' },
            { id: 3, name: '開発部' },
            { id: 4, name: '営業部' }
          ]
        })

      wrapper = mount(UsersNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('option[value="品質管理部"]').exists()).toBe(true)
      expect(wrapper.find('option[value="製造部"]').exists()).toBe(true)
      expect(wrapper.find('option[value="開発部"]').exists()).toBe(true)
      expect(wrapper.find('option[value="営業部"]').exists()).toBe(true)
    })
  })

  describe('部署名リストの取得に失敗した場合', () => {
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

      wrapper = mount(UsersNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: '部署名の取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('有効な情報を送信した場合', () => {
    it('登録に成功すること', async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '品質管理部' },
            { id: 2, name: '製造部' },
            { id: 3, name: '開発部' },
            { id: 4, name: '営業部' }
          ]
        })

      axios.post.mockResolvedValue({
        data: {
          id: 1,
          name: '渡辺 陸斗',
          department: '開発部',
          password: 'password',
          password_confirmation: 'password'
        }
      })

      wrapper = mount(UsersNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      await wrapper.find('#user-name').setValue('渡辺 陸斗')
      await wrapper.find('#user-department').setValue('開発部')
      await wrapper.find('#user-password').setValue('password')
      await wrapper.find('#user-password-confirmation').setValue('password')

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: 'ユーザー情報を登録しました。' }
      ])

      expect(pushMock).toHaveBeenCalledWith('/users/1')
    })
  })

  describe('無効な情報を送信した場合', () => {
    it('登録に失敗すること', async () => {
      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })

        .mockResolvedValueOnce({
          data: [
            { id: 1, name: '品質管理部' },
            { id: 2, name: '製造部' },
            { id: 3, name: '開発部' },
            { id: 4, name: '営業部' }
          ]
        })

      axios.post.mockRejectedValue({
        response: {
          status: 422
        }
      })

      wrapper = mount(UsersNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
      await wrapper.find('#user-name').setValue('')
      await wrapper.find('#user-department').setValue('開発部')
      await wrapper.find('#user-password').setValue('password')
      await wrapper.find('#user-password-confirmation').setValue('password')

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('入力に不備があります。')
    })
  })
})
