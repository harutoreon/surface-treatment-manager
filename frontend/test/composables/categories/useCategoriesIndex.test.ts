import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCategoriesIndex } from '@/composables/categories/useCategoriesIndex'
import type { MessageEmit } from '@/env'
import type { Category } from '@/composables/categories/useCategoriesIndex'
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

describe('useCategoriesIndex', (): void => {
  const emitMock: MessageEmit = vi.fn()

  beforeEach((): void => {
    vi.resetAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('categories の初期値が空の配列であること', (): void => {
      const { categories } = useCategoriesIndex(emitMock)
      expect(categories.value).toEqual([])
    })
  })

  describe('ロジックの検証', (): void => {
    describe('replaceStringWithEllipsis', (): void => {
      describe('概要文が 10 文字未満の場合', (): void => {
        it('省略されないこと', (): void => {
          const { categories, replaceStringWithEllipsis } = useCategoriesIndex(emitMock)

          categories.value = [
            {
              id: 1,
              item: 'めっき',
              summary: '金属または非金属'
            }
          ]

          replaceStringWithEllipsis()

          expect(categories.value[0].summary).toBe(
            '金属または非金属'
          )
        })
      })

      describe('概要文が 10 文字を超える場合', (): void => {
        it('省略されること', (): void => {
          const { categories, replaceStringWithEllipsis } = useCategoriesIndex(emitMock)

          categories.value = [
            {
              id: 1,
              item: 'めっき',
              summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
            }
          ]

          replaceStringWithEllipsis()

          expect(categories.value[0].summary).toBe(
            '金属または非金属の材...'
          )
        })
      })
    })

    describe('fetchCategoryList', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスがカテゴリーリストであること', async (): Promise<void> => {
          const mockResponse: Category[] = [
            {
              id: 1,
              item: 'めっき',
              summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
            }
          ]

          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })

          const { categories, fetchCategoryList,  } = useCategoriesIndex(emitMock)
          await fetchCategoryList()

          expect(categories.value).toEqual(mockResponse)
          expect(categories.value[0].summary).toEqual(mockResponse[0].summary)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

          const { fetchCategoryList } = useCategoriesIndex(emitMock)
          await fetchCategoryList()

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
