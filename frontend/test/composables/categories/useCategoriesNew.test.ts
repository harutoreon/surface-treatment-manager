import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCategoriesNew } from '@/composables/categories/useCategoriesNew'
import type { MessageEmit } from '@/env'
import type { Category } from '@/composables/categories/useCategoriesNew'
import axios from 'axios'

const { pushMock } = vi.hoisted(() => {
  return {
    pushMock: vi.fn()
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

describe('useCategoriesNew', (): void => {
  const emitMock: MessageEmit = vi.fn()

  beforeEach((): void => {
    vi.resetAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('item の初期値が空文字であること', (): void => {
      const { item } = useCategoriesNew(emitMock)
      expect(item.value).toBe('')
    })

    it('summary の初期値が空文字であること', (): void => {
      const { summary } = useCategoriesNew(emitMock)
      expect(summary.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', (): void => {
      const { errorMessage } = useCategoriesNew(emitMock)
      expect(errorMessage.value).toBe('')
    })
  })

  describe('ロジックの検証', (): void => {
    describe('categoryRegistration', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスに成功メッセージが含まれ、/categories/:id ルートに遷移すること', async (): Promise<void> => {
          const mockResponse: Category = {
            id: 1,
            item: 'めっき',
            summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
          }

          vi.mocked(axios.post).mockResolvedValueOnce({ data: mockResponse })

          const { errorMessage, categoryRegistration } = useCategoriesNew(emitMock)
          await categoryRegistration()

          expect(errorMessage.value).toBe('')
          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'カテゴリーを1件登録しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith(`/categories/${mockResponse.id}`)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('バリデーションエラーになること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.post).mockRejectedValueOnce({ response: { status: 422 } })

          const { errorMessage, categoryRegistration } = useCategoriesNew(emitMock)
          await categoryRegistration()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })
  })
})
