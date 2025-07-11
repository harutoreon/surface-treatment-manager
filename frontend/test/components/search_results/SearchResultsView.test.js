import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import SearchResultsView from '@/components/search_results/SearchResultsView.vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

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
  describe('DOMの構造', () => {
    let wrapper
    
    beforeEach(async () => {
      useRoute.mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })
  
      axios.get.mockResolvedValue({
        data: {
          keyword: 'めっき',
          samples: [
            { id: 1, name: 'ハードクロムめっき', maker: 'サンプルメーカー', category: 'めっき' },
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

    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('表面処理の検索結果')
    })

    it('検索結果が表示されること', () => {
      // 検索文字列
      expect(wrapper.text()).toContain('「めっき」')

      // 処理名
      expect(wrapper.text()).toContain('ハードクロムめっき')

      // メーカー名
      expect(wrapper.text()).toContain('サンプルメーカー')
    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.findComponent({ ref: 'linkResearch' }).exists()).toBe(true)
      expect(wrapper.findComponent({ ref: 'linkResearch' }).text()).toBe('再検索')
      expect(wrapper.findComponent({ ref: 'linkResearch' }).props().to).toBe('/static_pages/name')

      expect(wrapper.findComponent({ ref: 'linkHome' }).exists()).toBe(true)
      expect(wrapper.findComponent({ ref: 'linkHome' }).text()).toBe('メインメニューへ')
      expect(wrapper.findComponent({ ref: 'linkHome' }).props().to).toBe('/home')
    })
  })

  describe('API通信', () => {
    describe('レスポンスにサンプルが存在する場合', () => {
      it('取得したデータが画面に表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            keyword: 'めっき',
            samples: [
              { id: 1, name: 'ハードクロムめっき', maker: 'メーカーA', category: 'めっき' },
              { id: 2, name: '無電解ニッケルめっき', maker: 'メーカーB', category: 'めっき' },
            ]
          }
        })

        const wrapper = mount(SearchResultsView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('h5').text()).toBe('検索文字列：「めっき」')
        expect(wrapper.text()).toContain('ハードクロムめっき')
        expect(wrapper.text()).toContain('メーカーA')
        expect(wrapper.text()).toContain('無電解ニッケルめっき')
        expect(wrapper.text()).toContain('メーカーB')
      })
    })
    
    describe('レスポンスにサンプルが存在しない場合', () => {
      it('「該当する表面処理はありませんんでした。」のメッセージが表示されること', async () => {
        axios.get.mockResolvedValue({
          data: {
            keyword: 'めっき',
            samples: []
          }
        })
  
        const wrapper = mount(SearchResultsView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('h4').text()).toBe('該当する表面処理はありませんでした。')
      })
    })

    describe('サンプルの取得に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(SearchResultsView, {
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

    describe('ルートパラメータ別の表示', () => {
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
                { id: 1, name: 'ハードクロムめっき', maker: 'メーカーA', category: 'めっき' }
              ],
            }
          })

          const wrapper = mount(SearchResultsView, {
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
                { id: 1, name: 'ハードクロムめっき', maker: 'メーカーA', category: 'めっき' }
              ],
            }
          })

          const wrapper = mount(SearchResultsView, {
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
                { id: 1, name: 'ハードクロムめっき', maker: '株式会社テスト', category: 'めっき' }
              ],
            }
          })

          const wrapper = mount(SearchResultsView, {
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
  })
})
