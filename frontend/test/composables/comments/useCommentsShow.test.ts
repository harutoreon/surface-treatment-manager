import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCommentsShow } from '@/composables/comments/useCommentsShow.ts'
import type { CommentsResponse, Emit } from '@/composables/comments/useCommentsShow.ts'
import axios from 'axios'

const { replaceMock } = vi.hoisted(() => {
  return {
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
        replace: replaceMock,
      }
    }
  }
})

describe('useCommentsShow', (): void => {
  const emitMock: Emit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('comment の初期値が null であること', (): void => {
      const { comment } = useCommentsShow(emitMock)
      expect(comment.value).toBeNull()
    })

    it('sampleId の初期値が null であること', (): void => {
      const { sampleId } = useCommentsShow(emitMock)
      expect(sampleId.value).toBeNull()
    })

    it('makerId の初期値が null であること', (): void => {
      const { makerId } = useCommentsShow(emitMock)
      expect(makerId.value).toBeNull()
    })

    it('isAdmin の初期値が false であること', (): void => {
      const { isAdmin } = useCommentsShow(emitMock)
      expect(isAdmin.value).toBe(false)
    })
  })

  describe('ロジックの検証', (): void => {
    describe('fetchCommentData', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('レスポンスがコメント情報と sample_id と maker_id であること', async (): Promise<void> => {
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

          const {
            comment,
            sampleId,
            makerId,
            fetchCommentData,
          } = useCommentsShow(emitMock)
          await fetchCommentData('1')

          expect(comment.value).toEqual(mockResponse.comment)
          expect(sampleId.value).toBe(mockResponse.comment.sample_id)
          expect(makerId.value).toBe(mockResponse.maker_id)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージが含まれ、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

          const { fetchCommentData } = useCommentsShow(emitMock)
          await fetchCommentData('1')

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'コメント情報の取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })
  })
})