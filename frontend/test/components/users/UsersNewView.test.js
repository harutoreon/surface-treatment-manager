import UsersNewView from '@/components/users/UsersNewView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const pushMock = vi.fn()
const replaceMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: vi.fn()
      }
    },
    useRouter: () => {
      return {
        push: pushMock,
        replace: replaceMock
      }
    }
  }
})

describe('UsersNewView', () => {
  const mockResponse = [
    { id: 1, name: '品質管理部' },
  ]

  const mountComponent = () => mount(UsersNewView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', () => {
    describe('レンダリングに成功した場合', () => {
      it('ユーザー情報の登録ページが表示されること', async () => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockResponse })

        const wrapper = mountComponent()
        await flushPromises()

        // 見出し
        expect(wrapper.find('h3').text()).toBe('ユーザー情報の登録')

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

        // ボタン要素
        expect(wrapper.find('button').text()).toBe('登録')

        // 外部リンク
        const routerLink = wrapper.findComponent(RouterLinkStub)
        expect(routerLink.props().to).toBe('/users')
        expect(routerLink.text()).toBe('ユーザーリスト')
      })
    })

    describe('レンダリングに失敗した場合', () => {
      it('ログインページに遷移すること', async () => {
        vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 401 }  })

        const wrapper =  mountComponent()
        await flushPromises()

        expect(wrapper.emitted('message')).toBeTruthy()
        expect(wrapper.emitted('message')[0]).toEqual([
          { type: 'danger', text: 'ログインが必要です。' }
        ])
        expect(pushMock).toHaveBeenCalledWith('/')
      })
    })
  })


  describe('ユーザー登録', () => {
    describe('有効な情報を送信した場合', () => {
      it('登録に成功すること', async () => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockResponse })

        vi.mocked(axios.post).mockResolvedValue({
          data: {
            id: 1,
            name: '渡辺 陸斗',
            department: '開発部'
          }
        })

        const wrapper = mountComponent()
        await flushPromises()

        await wrapper.find('#user-name').setValue('渡辺 陸斗')
        await wrapper.find('#user-department').setValue('開発部')
        await wrapper.find('#user-password').setValue('password')
        await wrapper.find('#user-password-confirmation').setValue('password')

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(wrapper.emitted('message')).toBeTruthy()
        expect(wrapper.emitted('message')[0]).toEqual([
          { type: 'success', text: 'ユーザー情報を登録しました。' }
        ])

        expect(pushMock).toHaveBeenCalledWith('/users/1')
      })
    })

    describe('無効な情報を送信した場合', () => {
      it('登録に失敗すること', async () => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockResponse })

        vi.mocked(axios.post).mockRejectedValue({ response: { status: 422 } })

        const wrapper = mountComponent()
        await flushPromises()

        await wrapper.find('#user-name').setValue('')

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
      })
    })
  })
})
