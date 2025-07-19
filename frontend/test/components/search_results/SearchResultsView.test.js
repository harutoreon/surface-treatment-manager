import SearchResultsView from '@/components/search_results/SearchResultsView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { useRoute } from 'vue-router'
import axios from 'axios'

const replaceMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: vi.fn(),
    useRouter: () => {
      return {
        replace: replaceMock
      }
    }
  }
})

describe('SearchResultsNameView', () => {
  let wrapper

  describe('初期レンダリングでサンプルが存在した場合', () => {  
    beforeEach(async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })
  
      axios.get.mockResolvedValue({
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
      const linkResearch = wrapper.findComponent({ ref: 'linkResearch' })
      const linkHome = wrapper.findComponent({ ref: 'linkHome' })

      // to属性
      expect(linkResearch.text()).toBe('再検索')
      expect(linkHome.props().to).toBe('/home')

      // テキスト
      expect(linkResearch.props().to).toBe('/static_pages/name')
      expect(linkHome.text()).toBe('メインメニューへ')
    })
  })
    
  describe('初期レンダリングでサンプルが存在しない場合', () => {
    beforeEach(async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      axios.get.mockRejectedValue({
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
      axios.get.mockRejectedValue({
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
    it('再検索リンクのパスにnameが含まれていること', async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      axios.get.mockResolvedValue({
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

      expect(wrapper.findComponent({ ref: 'linkResearch' }).props().to).toBe('/static_pages/name')
    })
  })

  describe('ルートパラメータがcategoryの場合', () => {
    it('再検索リンクのパスにcategoryが含まれていること', async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'category' },
        query: { keyword: 'めっき' }
      })

      axios.get.mockResolvedValue({
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

      expect(wrapper.findComponent({ ref: 'linkResearch' }).props().to).toBe('/static_pages/category')
    })
  })

  describe('ルートパラメータがmakerの場合', () => {
    it('再検索リンクのパスにmakerが含まれていること', async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'maker' },
        query: { keyword: '株式会社' }
      })

      axios.get.mockResolvedValue({
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

      expect(wrapper.findComponent({ ref: 'linkResearch' }).props().to).toBe('/static_pages/maker')
    })
  })
})
