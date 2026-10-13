import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCategoriesShow } from '@/composables/categories/useCategoriesShow'
import { useCategoriesEdit } from '@/composables/categories/useCategoriesEdit'
import type { Category } from '@/composables/categories/useCategoriesShow'
import type { MessageEmit } from '@/env'
import axios from 'axios'

const { pushMock } = vi.hoisted(() => {
  return {
    pushMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock,
      }
    }
  }
})

describe('useCategoriesEdit', (): void => {
  const emitMock: MessageEmit = vi.fn()

  beforeEach((): void => {
    vi.resetAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('errorMessage の初期値が空文字であること', (): void => {
      const { category } = useCategoriesShow(emitMock)
      const { errorMessage } = useCategoriesEdit(emitMock, category)

      expect(errorMessage.value).toBe('')
    })

    it('updateCategory の初期値が null であること', (): void => {
      const { category } = useCategoriesShow(emitMock)
      const { updatedCategory } = useCategoriesEdit(emitMock, category)

      expect(updatedCategory.value).toBeNull()
    })
  })

  describe('ロジックの検証', (): void => {
    describe('categoryUpdate', (): void => {
      const getMockResponse: Category = {
        id: 1,
        item: 'めっき',
        summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      }

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスに成功メッセージを含み、/categories/:id ルートに遷移すること', async (): Promise<void> => {
          const patchMockResponse: Category = {
            id: 1,
            item: 'めっき',
            summary: '金属やプラスチックなどの基材の表面に、別の金属薄膜を覆いかぶせる表面処理技術のことです。'
          }

          vi.mocked(axios.patch).mockResolvedValueOnce({ data: patchMockResponse })

          const { category } = useCategoriesShow(emitMock)
          const {
            updatedCategory,
            errorMessage,
            categoryUpdate
          } = useCategoriesEdit(emitMock, category)

          category.value = getMockResponse
          await categoryUpdate()

          expect(errorMessage.value).toBe('')
          expect(updatedCategory.value).toEqual(patchMockResponse)
          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'カテゴリー情報を更新しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith(`/categories/${patchMockResponse.id}`)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('バリデーションエラーになること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.patch).mockRejectedValueOnce({ response: { status: 422 } })

          const { category } = useCategoriesShow(emitMock)
          const { errorMessage, categoryUpdate } = useCategoriesEdit(emitMock, category)

          category.value = getMockResponse
          await categoryUpdate()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })
  })
})
