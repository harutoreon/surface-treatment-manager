import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCommentsDestroy } from '@/composables/comments/useCommentsDestroy.ts'
import { useCommentsShow } from '@/composables/comments/useCommentsShow.ts'
import type { CommentsResponse, Emit } from '@/composables/comments/useCommentsShow.ts'
import axios from 'axios'

const { replaceMock, pushMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    pushMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock,
      }
    }
  }
})

describe('useCommentsDestroy', (): void => {
  const emitMock: Emit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('ロジックの検証', (): void => {
    describe('handleDelete', (): void => {
      beforeEach((): void => {
        vi.stubGlobal('confirm', vi.fn(() => true))
      })

      afterEach((): void => {
        vi.unstubAllGlobals()
      })

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスに成功メッセージが含まれ、コメントリストページに遷移すること', async (): Promise<void> => {
          const adminUserId: number = 49
          const mockResponse: CommentsResponse = {
            comment: {
              id: 1,
              body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
              commenter: '工藤 琴音',
              department: '品質管理部',
              sample_id: 16,
              user_id: 34
            },
            maker_id: 1
          }

          vi.mocked(axios.get)
            .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
            .mockResolvedValueOnce({ data: mockResponse })

          vi.mocked(axios.delete).mockResolvedValue( { data: { status: 204 } })

          const {
            comment,
            sampleId,
            makerId,
            fetchCommentData,
          } = useCommentsShow(emitMock)

          const { handleDelete } = useCommentsDestroy(emitMock, makerId, sampleId, comment)

          await fetchCommentData('1')
          await handleDelete()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'コメント情報を1件削除しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith('/comments')
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          const adminUserId: number = 49
          const mockResponse: CommentsResponse = {
            comment: {
              id: 1,
              body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
              commenter: '工藤 琴音',
              department: '品質管理部',
              sample_id: 16,
              user_id: 34
            },
            maker_id: 1
          }

          vi.mocked(axios.get)
            .mockResolvedValueOnce({ data: { payload: { user_id: adminUserId } } })
            .mockResolvedValueOnce({ data: mockResponse })

          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.delete).mockRejectedValueOnce({ response: { status: 404 } })

          const {
            comment,
            sampleId,
            makerId,
            fetchCommentData,
          } = useCommentsShow(emitMock)

          const { handleDelete } = useCommentsDestroy(emitMock, makerId, sampleId, comment)

          await fetchCommentData('1')
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
