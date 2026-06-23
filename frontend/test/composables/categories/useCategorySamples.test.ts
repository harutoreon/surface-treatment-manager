import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCategorySamples } from '@/composables/categories/useCategorySamples.ts'
import type { Sample, Emit } from '@/composables/categories/useCategorySamples.ts'
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
    },
  }
})

describe('useCategories', (): void => {
  const emitMock: Emit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('categorySamples の初期値が空の配列であること', (): void => {
      const { categorySamples } = useCategorySamples(emitMock)
      expect(categorySamples.value).toEqual([])
    })
  })

  describe('ロジックの検証', (): void => {
    describe('fetchCategorySamples', (): void => {
      const mockResponse: Sample[] = [
        {
          id: 1,
          name: 'sample name',
          color: 'sample color',
          hardness: 'sample hardness',
          film_thickness: 'sample film_thickness',
          feature: 'sample feature',
          summary: 'sample summary',
          maker_id: 1,
          category_id: 1,
        }
      ]

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスはサンプルリストであること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })

          const { categorySamples, fetchCategorySamples } = useCategorySamples(emitMock)
          await fetchCategorySamples(`${mockResponse[0]}.id`)

          expect(categorySamples.value).toEqual(mockResponse)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })

          const { fetchCategorySamples } = useCategorySamples(emitMock)
          await fetchCategorySamples(`${mockResponse[0]}.id`)

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'サンプルリストの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })
  })
})
