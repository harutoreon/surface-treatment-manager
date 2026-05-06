import UsersIndexView from '@/components/users/UsersIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replacMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: 1 }
      }
    },
    useRouter: () => {
      return {
        replace: replacMock
      }
    }
  }
})

describe('UsersIndexView', () => {
  const mockResponse = {
    users: [
      { id: 1, name: '佐藤 海翔', department: '品質管理部' }
    ],
    current_page: 1,
    total_pages: 1
  }

  const mountComponent = () => mount(UsersIndexView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期レンダリングに成功した場合', () => {
    it('ユーザーリストページが表示されること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })

      const wrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('ユーザーリスト')

      // ユーザー名
      expect(wrapper.text()).toContain('佐藤 海翔')

      // 部署名
      expect(wrapper.text()).toContain('品質管理部')

      // ページネーション
      expect(wrapper.text()).toContain('前ページ')
      expect(wrapper.text()).toContain('次ページ')
      expect(wrapper.find('a[class="page-link"]').text()).toBe('1')

      // 外部リンク
      const ulElement = wrapper.find('.nav')
      const routerLinks = ulElement.findAllComponents(RouterLinkStub)
      const newLink = routerLinks.find(element => element.props().to === '/users/new')
      const homeLink = routerLinks.find(element => element.props().to === '/home')

      expect(newLink.text()).toBe('ユーザー情報の登録')
      expect(homeLink.text()).toBe('メインメニューへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockRejectedValueOnce({ response: { status: 404 } })

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.emitted('message')).toBeTruthy()
      expect(wrapper.emitted('message')[0]).toEqual([
        { type: 'danger', text: 'ユーザーリストの取得に失敗しました。' }
      ])
      expect(replacMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})
