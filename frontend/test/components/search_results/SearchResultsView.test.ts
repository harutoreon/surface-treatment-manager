import SearchResultsView from '@/components/search_results/SearchResultsView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { DataResponse } from '@/composables/search_results/useSearchResults'
import type { VueWrapper } from '@vue/test-utils'
import axios from 'axios'

const { pushMock } = vi.hoisted(() => {
  return {
    pushMock: vi.fn()
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' },
      }
    },
    useRouter: () => {
      return {
        push: pushMock,
      }
    }
  }
})

describe('SearchResultsNameView', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', (): void => {
    describe('サンプルがある場合', (): void => {
      it('検索文字列と該当件数が表示される', async (): Promise<void> => {
        const mockResponse: DataResponse = {
          samples: [
            {
              id: 1,
              name: 'めっきを含む処理名',
              color: 'サンプル色',
              feature: '特性',
            }
          ],
          keyword: 'めっき',
        }

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })  // ログインチェック
          .mockResolvedValueOnce({ data: mockResponse })  // fetchSearchResults()

        const wrapper: VueWrapper = mount(SearchResultsView, {
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

    describe('サンプルがない場合', (): void => {
      it('検索文字列と該当無しが表示される', async (): Promise<void> => {
        const mockResponse: DataResponse = {
          samples: [],
          keyword: 'めっき'
        }

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })  // ログインチェック
          .mockResolvedValueOnce({ data: mockResponse })  // fetchSearchResults()

        const wrapper: VueWrapper = mount(SearchResultsView, {
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
})
