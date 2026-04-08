import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { useSearchResults } from '@/composables/useSearchResults.js'
import { useRoute } from 'vue-router'

const replaceMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: vi.fn(),
    useRouter: () => {
      return {
        replace: replaceMock,
      }
    }
  }
})

describe('useSearchResults', () => {
  describe('fetchSearchResults', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      vi.mocked(useRoute).mockReturnValue({
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })
    })

    it('初期状態では samples は空であること', () => {
      const { samples } = useSearchResults()
      expect(samples.value).toEqual([])
    })

    describe('リクエストに成功した場合', () => {
      it('data と samples にレスポンスのデータが格納されること', async () => {
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

        axios.get.mockResolvedValue({ data: mockResponse })

        const { samples, data, fetchSearchResults } = useSearchResults()
        await fetchSearchResults()

        expect(data.value.keyword).toBe(mockResponse.keyword)
        expect(samples.value).toEqual(mockResponse.samples)
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/name_search'),
          { params: { keyword: 'めっき'} }
        )
      })
    })

    describe('リクエストに失敗した場合', () => {
      it('エラーメッセージを emit して、NotFound へリダイレクトすること', async () => {
        const emitMock = vi.fn()

        axios.get.mockRejectedValue({
          response: { status: 404 }
        })

        const { fetchSearchResults } = useSearchResults(emitMock)
        await fetchSearchResults()

        expect(emitMock).toHaveBeenCalledTimes(1)
        expect(emitMock).toHaveBeenCalledWith('message', {
          type: 'danger',
          text: 'サンプルの取得に失敗しました。'
        })
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
