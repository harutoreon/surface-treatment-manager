import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'
import SearchResultsListView from '@/components/search_results/SearchResultsListView.vue'
import type { MessageEmit } from '@/env'
import type { VueWrapper } from '@vue/test-utils'

const { replaceMock, requireLoginMock} = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    requireLoginMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        replace: replaceMock,
      }
    }
  }
})
vi.mock('@/composables/auth/useAuthGuard', () => {
  return {
    useAuthGuard: () => {
      return {
        requireLogin: requireLoginMock
      }
    }
  }
})

describe('SearchResultsListView', (): void => {
  const mountComponent = (): VueWrapper => mount(SearchResultsListView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
    requireLoginMock.mockResolvedValueOnce(true)
  })

  describe('ページのマウントに成功した場合', (): void => {
    it('表面処理一覧ページが表示されること', async (): Promise<void> => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: { status: 200 } })  // fetchSearchResults()

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('表面処理一覧')
    })
  })

  describe('ページのマウントに失敗した場合', (): void => {
    it('ログインページに遷移すること', async (): Promise<void> => {
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })  // fetchSearchResults()

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage![0][0]).toEqual(
        { type: 'danger', text: 'サンプルの取得に失敗しました。' }
      )
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})
