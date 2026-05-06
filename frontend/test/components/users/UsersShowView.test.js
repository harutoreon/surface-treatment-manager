import UsersShowView from '@/components/users/UsersShowView.vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()
const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: 1 },
        query:  { page: 1 }
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

describe('UsersShowView', () => {
  const mockResponse = {
    id: 1,
    name: '渡辺 陸斗',
    department: '開発部'
  }

  const mountComponent = () => mount(UsersShowView, {
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
      it('ユーザー情報ページが表示されること', async () => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockResponse })

        const wrapper = mountComponent()
        await flushPromises()

        // 見出し
        expect(wrapper.find('h3').text()).toBe('ユーザー情報')

        // ユーザー名
        expect(wrapper.text()).toContain('渡辺 陸斗')

        // 部署名
        expect(wrapper.text()).toContain('開発部')

        // 外部リンク
        const routerLinks = wrapper.findAllComponents(RouterLinkStub)
        const editLink = routerLinks.find(
          element => element.props().to === '/users/1/edit')
        const listLink = routerLinks.find(
          element => element.props().to === '/users')

        expect(editLink.text()).toBe('ユーザー情報の編集')
        expect(listLink.text()).toBe('ユーザーリスト')

        // 削除ボタン
        expect(wrapper.find('button').text()).toBe('ユーザーの削除')
      })
    })

    describe('レンダリングに失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockRejectedValueOnce({ response: { status: 404 } })

        const wrapper = mountComponent()
        await flushPromises()

        expect(wrapper.emitted('message')).toBeTruthy()
        expect(wrapper.emitted('message')[0]).toEqual([
          { type: 'danger', text: 'ユーザー情報の取得に失敗しました。' }
        ])
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })

  describe('ユーザー情報の削除', () => {
    beforeEach(() => {
      vi.stubGlobal('confirm', vi.fn(() => true))
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    describe('削除に成功した場合', () => {
      it('ユーザーリストページに遷移すること', async () => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockResponse })

        const wrapper = mountComponent()
        await flushPromises()

        await wrapper.find('button').trigger('click')
        await flushPromises()

        expect(wrapper.emitted('message')).toBeTruthy()
        expect(wrapper.emitted('message')[0]).toEqual([
          { type: 'success', text: 'ユーザー情報を削除しました。' }
        ])
        expect(pushMock).toHaveBeenCalledWith('/users')
      })
    })

    describe('削除に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockResponse })

        vi.mocked(axios.delete).mockRejectedValue({ response: { status: 404 } })

        const wrapper = mountComponent()
        await flushPromises()

        await wrapper.find('button').trigger('click')
        await flushPromises()

        expect(wrapper.emitted('message')).toBeTruthy()
        expect(wrapper.emitted('message')[0]).toEqual([
          { type: 'danger', text: 'ユーザー情報の削除に失敗しました。' }
        ])
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
