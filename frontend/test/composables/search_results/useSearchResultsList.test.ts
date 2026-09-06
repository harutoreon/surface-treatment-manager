import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSearchResultsList } from '@/composables/search_results/useSearchResultsList'
import type { Sample } from '@/composables/search_results/useSearchResultsList'
import type { MessageEmit } from '@/env'
import axios from 'axios'

const { replaceMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn()
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

describe('useSearchResultsList', (): void => {
  const emitMock: MessageEmit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('fetchSearchResults', (): void => {
    describe('リクエストに成功した場合', (): void => {
      it('samplesにレスポンスのデータが格納されること', async (): Promise<void> => {
        const mockResponse: Sample[] = [
          {
            id: 1,
            name: '表面処理名',
            summary: '概要文',
            image_url: 'http://test-api/test.jpg',
          }
        ]

        vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })

        const { samples, fetchSearchResults } = useSearchResultsList(emitMock)
        await fetchSearchResults()

        expect(samples.value).toEqual(mockResponse)
      })
    })

    describe('リクエストに失敗した場合', (): void => {
      it('エラーメッセージをemitして、NotFoundへリダイレクトすること', async (): Promise<void> => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })

        const { fetchSearchResults } = useSearchResultsList(emitMock)
        await fetchSearchResults()

        expect(emitMock).toHaveBeenCalledWith(
          'message',
          { type: 'danger', text: 'サンプルの取得に失敗しました。'}
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})