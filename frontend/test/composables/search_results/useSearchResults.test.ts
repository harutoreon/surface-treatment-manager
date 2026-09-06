import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { useSearchResults } from '@/composables/search_results/useSearchResults'
import type { MessageEmit } from '@/env'
import type { DataResponse } from '@/composables/search_results/useSearchResults'

const { replaceMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn()
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
        replace: replaceMock,
      }
    }
  }
})

describe('useSearchResults', (): void => {
  const emitMock: MessageEmit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('fetchSearchResults', (): void => {
    it('初期状態では samples は空であること', (): void => {
      const { samples } = useSearchResults(emitMock)
      expect(samples.value).toEqual([])
    })

    describe('リクエストに成功した場合', (): void => {
      it('data と samples にレスポンスのデータが格納されること', async (): Promise<void> => {
        const mockResponse: DataResponse = {
          samples: [
            {
              id: 1,
              name: '無電解ニッケルめっき',
              color: 'イエローシルバー',
              feature: '耐食性・耐腐食性・耐熱性',
            }
          ],
          keyword: 'めっき'
        }

        vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })

        const {
          samples,
          data,
          fetchSearchResults
        } = useSearchResults(emitMock)
        await fetchSearchResults()

        expect(data.value.keyword).toBe(mockResponse.keyword)
        expect(samples.value).toEqual(mockResponse.samples)
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/name_search'),
          expect.objectContaining({ params: { keyword: `${mockResponse.keyword}` } })
        )
      })
    })

    describe('リクエストに失敗した場合', (): void => {
      it('エラーメッセージを emit して、NotFound へリダイレクトすること', async (): Promise<void> => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

        const { fetchSearchResults } = useSearchResults(emitMock)
        await fetchSearchResults()

        expect(emitMock).toHaveBeenCalledWith(
          'message',
          { type: 'danger', text: 'サンプルの取得に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
