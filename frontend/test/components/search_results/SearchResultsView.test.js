import SearchResultsView from '@/components/search_results/SearchResultsView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { useRoute } from 'vue-router'
import axios from 'axios'

const replaceMock = vi.fn()
const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: vi.fn(),
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock
      }
    }
  }
})

describe('SearchResultsNameView', () => {
  let wrapper

  describe('ログインチェックに成功した場合', () => {
    it('表面処理の検索結果ページに移動すること', async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({
          data: {
            keyword: 'めっき',
            samples: [
              { id: 1,
                name: 'ハードクロムめっき',
                maker: '谷口情報株式会社',
                category: 'めっき'
              },
            ]
          }
        })

      wrapper = mount(SearchResultsView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('表面処理の検索結果')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      axios.get.mockRejectedValue({  // checkLoginStatus()
        response: {
          status: 401
        }
      })

      wrapper = mount(SearchResultsView, {
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

  describe('初期レンダリングでサンプルが存在した場合', () => {  
    beforeEach(async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValueOnce({
          data: {
            keyword: 'めっき',
            samples: [
              { id: 1,
                name: 'ハードクロムめっき',
                maker: '谷口情報株式会社',
                category: 'めっき'
              },
            ]
          }
        })

      wrapper = mount(SearchResultsView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('表面処理の検索結果')
    })

    it('サンプルの検索結果が表示されること', () => {
      // 検索文字列
      expect(wrapper.text()).toContain('「めっき」')

      // 処理名
      expect(wrapper.text()).toContain('ハードクロムめっき')

      // メーカー名
      expect(wrapper.text()).toContain('谷口情報株式会社')
    })

    it('外部リンクが表示されること', () => {
      const div = wrapper.find('div[class="d-flex justify-content-evenly mt-5 mb-5"]')
      const routerLinks = div.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].text()).toBe('再検索')
      expect(routerLinks[1].props().to).toBe('/home')

      // テキスト
      expect(routerLinks[0].props().to).toBe('/static_pages/name')
      expect(routerLinks[1].text()).toBe('メインメニューへ')
    })
  })
    
  describe('初期レンダリングでサンプルが存在しない場合', () => {
    beforeEach(async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      axios.get
        .mockResolvedValueOnce({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockRejectedValueOnce({
          data: {
            keyword: 'めっき',
            samples: []
          }
        })

      wrapper = mount(SearchResultsView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('サンプルが表示されること', () => {
      expect(wrapper.find('h4').text()).toBe('該当する表面処理はありませんでした。')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

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

      wrapper = mount(SearchResultsView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'サンプルの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('ルートパラメータがnameの場合', () => {
    beforeEach(async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      axios.get
        .mockResolvedValue({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValue({
          data: {
            keyword: 'めっき',
            samples: [
              { id: 1,
                name: 'ハードクロムめっき',
                maker: '谷口情報株式会社',
                category: 'めっき'
              },
            ],
          }
        })

      wrapper = mount(SearchResultsView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('再検索リンクのパスにnameが含まれていること', async () => {
      const div = wrapper.find('div[class="d-flex justify-content-evenly mt-5 mb-5"]')
      const routerLink = div.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/static_pages/name')
    })
  })

  describe('ルートパラメータがcategoryの場合', () => {
    beforeEach(async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'category' },
        query: { keyword: 'めっき' }
      })

      axios.get
        .mockResolvedValue({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValue({
          data: {
            keyword: 'めっき',
            samples: [
              { id: 1,
                name: 'ハードクロムめっき',
                maker: '谷口情報株式会社',
                category: 'めっき'
              },
            ],
          }
        })

      wrapper = mount(SearchResultsView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('再検索リンクのパスにcategoryが含まれていること', async () => {
      const div = wrapper.find('div[class="d-flex justify-content-evenly mt-5 mb-5"]')
      const routerLink = div.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/static_pages/category')
    })
  })

  describe('ルートパラメータがmakerの場合', () => {
    beforeEach(async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'maker' },
        query: { keyword: '株式会社' }
      })

      axios.get
        .mockResolvedValue({  // checkLoginStatus()
          response: {
            status: 200
          }
        })
        .mockResolvedValue({
          data: {
            keyword: '株式会社',
            samples: [
              { id: 1,
                name: 'ハードクロムめっき',
                maker: '谷口情報株式会社',
                category: 'めっき'
              },
            ],
          }
        })

      wrapper = mount(SearchResultsView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('再検索リンクのパスにmakerが含まれていること', async () => {
      const div = wrapper.find('div[class="d-flex justify-content-evenly mt-5 mb-5"]')
      const routerLink = div.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/static_pages/maker')
    })
  })
})
