import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCommentsEdit } from '@/composables/comments/useCommentsEdit.ts'
import type { CommentResponse, Emit } from '@/composables/comments/useCommentsEdit.ts'
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
    useRoute: () => {
      return {
        params: { id: '1' }
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock,
      }
    }
  }
})

describe('useCommentsEdit', (): void => {
  const emitMock: Emit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('comment の初期値が null であること', (): void => {
      const { comment } = useCommentsEdit(emitMock)
      expect(comment.value).toBeNull()
    })

    it('sampleId の初期値が null であること', (): void => {
      const { sampleId } = useCommentsEdit(emitMock)
      expect(sampleId.value).toBeNull()
    })

    it('makerId の初期値が null であること', (): void => {
      const { makerId } = useCommentsEdit(emitMock)
      expect(makerId.value).toBeNull()
    })

    it('errorMessage の初期値が空文字であること', (): void => {
      const { errorMessage } = useCommentsEdit(emitMock)
      expect(errorMessage.value).toBe('')
    })
  })

  describe('ロジックの検証', (): void => {
    const mockCommentResponse: CommentResponse = {
      comment: {
        id: 1,
        commenter: '高木 優花',
        body: 'めっき処理が均一で、気泡や不純物がありません。',
        sample_id: 1,
        department: '営業部',
        user_id: 1,
      },
      maker_id: 1
    }

    const mockPostCommentResponse = {
      id: 1,
      commenter: '高木 優花',
      body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
      sample_id: 1,
      department: '営業部',
      user_id: 1,
    }

    describe('fetchCommentData', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスがコメント情報とメーカーidが返ること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValue({ data: mockCommentResponse })

          const {
            comment,
            sampleId,
            makerId,
            fetchCommentData
          } = useCommentsEdit(emitMock)

          await fetchCommentData('1')

          expect(comment.value).toEqual(mockCommentResponse.comment)
          expect(sampleId.value).toBe(mockCommentResponse.comment.sample_id)
          expect(makerId.value).toBe(mockCommentResponse.maker_id)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })

          const { fetchCommentData } = useCommentsEdit(emitMock)
          await fetchCommentData('1')

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'コメント情報の取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('commentUpdate', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスに成功メッセージを含み、コメント情報ページに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockCommentResponse })
          vi.mocked(axios.patch).mockResolvedValueOnce({ data: mockPostCommentResponse })

          const { comment, fetchCommentData, commentUpdate } = useCommentsEdit(emitMock)
          await fetchCommentData('1')
          await commentUpdate()

          expect(comment.value).toEqual(mockPostCommentResponse)
          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'コメント情報を更新しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith(`/comments/${mockPostCommentResponse.id}`)
        })

      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスがエラーメッセージであること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockCommentResponse })
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.patch).mockRejectedValueOnce({ response: { status: 422 } })

          const {
            errorMessage,
            fetchCommentData,
            commentUpdate,
          } = useCommentsEdit(emitMock)

          await fetchCommentData('1')
          await commentUpdate()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })

      })
    })
  })
})