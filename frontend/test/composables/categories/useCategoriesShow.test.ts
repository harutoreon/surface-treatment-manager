import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCategoriesShow } from '@/composables/categories/useCategoriesShow'
import type { MessageEmit } from '@/env'
import type { Category } from '@/composables/categories/useCategoriesShow'
import axios from 'axios'

const { replaceMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
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

describe('useCategoriesShow', (): void => {
  const emitMock: MessageEmit = vi.fn()

  beforeEach((): void => {
    vi.resetAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('category の初期値が null であること', (): void => {
      const { category } = useCategoriesShow(emitMock)
      expect(category.value).toBe(null)
    })
  })

  describe('ロジックの検証', (): void => {
    describe('fetchCategoryData', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスがカテゴリー情報であること', async (): Promise<void> => {
          const mockResponse: Category = {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          }

          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })

          const { category, fetchCategoryData } = useCategoriesShow(emitMock)
          await fetchCategoryData('1')

          expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining(`/categories/${mockResponse.id}`)
          )
          expect(category.value).toEqual(mockResponse)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを emit して、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })


          const { fetchCategoryData } = useCategoriesShow(emitMock)
          await fetchCategoryData('1')

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })
  })
})
