import SearchResultsView from '@/components/search_results/SearchResultsView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { useRoute } from 'vue-router'
import axios from 'axios'

const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: vi.fn(),
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('SearchResultsNameView', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useRoute).mockReturnValue({
      params: { searchMethod: 'name' },
      query: { keyword: 'めっき' }
    })
  })

  describe('ページのマウントに成功して', () => {
    describe('サンプルがある場合', () => {
      it('検索文字列と該当件数が表示される', async () => {
        const mockResponse = {
          samples: [
            {
              id: 1,
              name: 'めっきを含む処理名',
              category_id: 1,
              color: 'サンプル色',
              maker_id: 1,
              hardness: '硬度',
              film_thickness: '膜厚',
              feature: '特性',
              summary: '概要文',
            }
          ],
          keyword: 'めっき'
        }

        axios.get
          .mockResolvedValueOnce({ status: 200 })  // ログインチェック
          .mockResolvedValueOnce({ data: mockResponse })  // fetchSearchResults()

        const wrapper = mount(SearchResultsView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('.fs-5').text()).toBe('検索文字列：「めっき」で 1 件の検索結果')
      })
    })

    describe('サンプルがない場合', () => {
      it('検索文字列と該当無しが表示される', async () => {
        const mockResponse = {
          samples: [],
          keyword: 'めっき'
        }

        axios.get
          .mockResolvedValueOnce({ status: 200 })  // ログインチェック
          .mockResolvedValueOnce({ data: mockResponse })  // fetchSearchResults()

        const wrapper = mount(SearchResultsView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.find('.fs-5').text()).toBe('検索文字列：「めっき」で該当無し')
      })
    })
  })

  describe('ページのマウントに失敗した場合', () => {
    it('ログインページに遷移すること', async () => {
      axios.get.mockRejectedValue({ response: { status: 401 } })
      vi.mocked(axios.isAxiosError).mockReturnValue(true)

      const wrapper = mount(SearchResultsView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })
})
