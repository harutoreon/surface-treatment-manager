import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSamplesIndex } from '@/composables/samples/useSamplesIndex.ts'
import axios from 'axios'

interface Sample {
  id: number
  name: string
  color: string
  feature: string
}

interface SampleListResponse {
  samples: Sample[]
  current_page: number
  total_pages: number
}

interface EmitFn {
  (event: 'message', payload: { type: 'success' | 'danger'; text: string }): void
}

const emitMock: EmitFn = vi.fn()
const replaceMock: ReturnType<typeof vi.fn> = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: 1 },
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
      }
    }
  }
})

describe('useSamplesIndex', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('samples の初期値が空の配列であること', (): void => {
      const { samples } = useSamplesIndex(emitMock)
      expect(samples.value).toEqual([])
    })

    it('currentPage の初期値が 1 であること', (): void => {
      const { currentPage } = useSamplesIndex(emitMock)
      expect(currentPage.value).toBe(1)
    })

    it('totalPages の初期値が 1 であること', (): void => {
      const { totalPages } = useSamplesIndex(emitMock)
      expect(totalPages.value).toBe(1)
    })
  })

  describe('ロジックの検証', (): void => {
    describe('fetchSampleList', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスが表面処理一覧とページ情報であること', async (): Promise<void> => {
          const mockResponse: SampleListResponse = {
            samples: [
              {
                id: 1,
                name: 'sample name',
                color: 'sample color',
                feature: 'sample feature'
              },
            ],
            current_page: 1,
            total_pages: 1,
          }

          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })

          const {
            samples,
            currentPage,
            totalPages,
            fetchSampleList
          } = useSamplesIndex(emitMock)

          await fetchSampleList()

          expect(samples.value).toEqual(mockResponse.samples)
          expect(currentPage.value).toEqual(mockResponse.current_page)
          expect(totalPages.value).toEqual(mockResponse.total_pages)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートの呼び出しがあること', async (): Promise<void> => {
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })
          vi.mocked(axios.isAxiosError).mockReturnValue(true)

          const { fetchSampleList } = useSamplesIndex(emitMock)
          await fetchSampleList()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: '表面処理リストの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })
  })
})