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
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            keyword: 'めっき',
            samples: [
              {
                id: 7,
                name: '錫めっき',
                category: 'めっき',
                color: 'ホワイトシルバー',
                hardness: 'Hv9.5～10.5程度',
                film_thickness: '光沢スズめっきで3～10μm、無光沢スズめっきで5～20μm程度',
                feature: '耐食性・潤滑性・摺動性',
                summary: '錫を電気めっきや化学めっきで表面に薄く被覆する技術です。',
                maker_id: 3
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

      expect(wrapper.find('p.fs-3').text()).toBe('表面処理の検索結果')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      axios.get.mockRejectedValue({
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
      expect(pushMock).not.toHaveBeenCalledWith('/name_search')
    })
  })

  describe('初期レンダリングでサンプルが存在した場合', () => {  
    beforeEach(async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            keyword: 'めっき',
            samples: [
              {
                id: 7,
                name: '錫めっき',
                category: 'めっき',
                color: 'ホワイトシルバー',
                hardness: 'Hv9.5～10.5程度',
                film_thickness: '光沢スズめっきで3～10μm、無光沢スズめっきで5～20μm程度',
                feature: '耐食性・潤滑性・摺動性',
                summary: '錫を電気めっきや化学めっきで表面に薄く被覆する技術です。',
                maker_id: 3
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
      expect(wrapper.find('p.fs-3').text()).toBe('表面処理の検索結果')
    })

    it('サンプルの検索結果が表示されること', () => {
      // 検索文字列
      expect(wrapper.text()).toContain('「めっき」')

      // 処理名
      expect(wrapper.text()).toContain('錫めっき')

      // 主な機能
      expect(wrapper.text()).toContain('耐食性・潤滑性・摺動性')

      // 色
      expect(wrapper.text()).toContain('ホワイトシルバー')
    })

    it('外部リンクが表示されること', () => {
      const ulElements = wrapper.find('ul')
      const routerLinks = ulElements.findAllComponents(RouterLinkStub)

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
        .mockResolvedValueOnce({
          status: 200
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
      expect(wrapper.find('p.fs-4').text()).toBe('該当する表面処理はありませんでした。')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockRejectedValueOnce({
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
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            keyword: 'めっき',
            samples: [
              {
                id: 7,
                name: '錫めっき',
                category: 'めっき',
                color: 'ホワイトシルバー',
                hardness: 'Hv9.5～10.5程度',
                film_thickness: '光沢スズめっきで3～10μm、無光沢スズめっきで5～20μm程度',
                feature: '耐食性・潤滑性・摺動性',
                summary: '錫を電気めっきや化学めっきで表面に薄く被覆する技術です。',
                maker_id: 3
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

    it('再検索リンクのパスにnameが含まれていること', async () => {
      const ulElements = wrapper.find('ul')
      const routerLinks = ulElements.findAllComponents(RouterLinkStub)

      expect(routerLinks[0].props().to).toBe('/static_pages/name')
    })
  })

  describe('ルートパラメータがcategoryの場合', () => {
    beforeEach(async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'category' },
        query: { keyword: 'めっき' }
      })

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            keyword: 'めっき',
            samples: [
              {
                id: 7,
                name: '錫めっき',
                category: 'めっき',
                color: 'ホワイトシルバー',
                hardness: 'Hv9.5～10.5程度',
                film_thickness: '光沢スズめっきで3～10μm、無光沢スズめっきで5～20μm程度',
                feature: '耐食性・潤滑性・摺動性',
                summary: '錫を電気めっきや化学めっきで表面に薄く被覆する技術です。',
                maker_id: 3
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

    it('再検索リンクのパスにcategoryが含まれていること', async () => {
      const ulElements = wrapper.find('ul')
      const routerLinks = ulElements.findAllComponents(RouterLinkStub)

      expect(routerLinks[0].props().to).toBe('/static_pages/category')
    })
  })

  describe('ルートパラメータがmakerの場合', () => {
    beforeEach(async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'maker' },
        query: { keyword: '株式会社' }
      })

      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            keyword: 'めっき',
            samples: [
              {
                id: 7,
                name: '錫めっき',
                category: 'めっき',
                color: 'ホワイトシルバー',
                hardness: 'Hv9.5～10.5程度',
                film_thickness: '光沢スズめっきで3～10μm、無光沢スズめっきで5～20μm程度',
                feature: '耐食性・潤滑性・摺動性',
                summary: '錫を電気めっきや化学めっきで表面に薄く被覆する技術です。',
                maker_id: 3
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

    it('再検索リンクのパスにmakerが含まれていること', async () => {
      const ulElements = wrapper.find('ul')
      const routerLinks = ulElements.findAllComponents(RouterLinkStub)

      expect(routerLinks[0].props().to).toBe('/static_pages/maker')
    })
  })
})
