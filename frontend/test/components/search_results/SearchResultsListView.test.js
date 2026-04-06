import SearchResultsListView from '@/components/search_results/SearchResultsListView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const pushMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock,
      }
    }
  }
})

vi.mock('axios')

describe('SearchResultsListView', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  describe('ページのマウントに成功した場合', () => {
    it('表面処理一覧ページが表示されること', async () => {
      axios.get
        .mockResolvedValueOnce({ status: 200 })  // ログインチェック
        .mockResolvedValueOnce({ status: 200 })  // fetchSearchResults()

      const wrapper = mount(SearchResultsListView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('表面処理一覧')
    })
  })

  describe('ページのマウントに失敗した場合', () => {
    it('ログインページに遷移すること', async () => {
      axios.get.mockRejectedValue({ response: { status: 401 } })

      const wrapper = mount(SearchResultsListView, {
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
