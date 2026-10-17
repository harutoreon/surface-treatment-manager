import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCategoriesDestroy } from '@/composables/categories/useCategoriesDestroy'
import type { MessageEmit } from '@/env'
import axios from 'axios'

const { pushMock, replaceMock } = vi.hoisted(() => {
  return {
    pushMock: vi.fn(),
    replaceMock: vi.fn()
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1' }
      }
    },
    useRouter: () => {
      return {
        push: pushMock,
        replace: replaceMock,
      }
    }
  }
})

describe('useCategoriesDestroy', (): void => {
  const emitMock: MessageEmit = vi.fn()

  beforeEach((): void => {
    vi.resetAllMocks()
  })

  describe('ロジックの検証', (): void => {
    describe('handleDelete', (): void => {
      beforeEach((): void => {
        vi.stubGlobal('confirm', vi.fn((): boolean => true))
      })

      afterEach((): void => {
        vi.unstubAllGlobals()
      })

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスに成功メッセージを含み、/categories ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.delete).mockResolvedValueOnce({ data: { status: 204 } })
          const { handleDelete } = useCategoriesDestroy(emitMock)
          await handleDelete()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'カテゴリーを1件削除しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith('/categories')
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.delete).mockRejectedValueOnce({ response: { status: 404 } })

          const { handleDelete } = useCategoriesDestroy(emitMock)
          await handleDelete()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: '削除処理に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })
  })
})
