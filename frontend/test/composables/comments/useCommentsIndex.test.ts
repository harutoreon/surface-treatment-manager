import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCommentsIndex } from '@/composables/comments/useCommentsIndex.ts'
import type { CommentsResponse, Emit } from '@/composables/comments/useCommentsIndex.ts'
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
        query: { page: '1' },
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
      }
    }
  }
})

describe('useCommentsIndex', (): void => {
  const emitMock: Emit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('comments の初期値が空の配列であること', (): void => {
      const { comments } = useCommentsIndex(emitMock)
      expect(comments.value).toEqual([])
    })

    it('currentPage の初期値が 1 であること', (): void => {
      const { currentPage } = useCommentsIndex(emitMock)
      expect(currentPage.value).toBe(1)
    })

    it('totalPages の初期値が 1 であること', (): void => {
      const { totalPages } = useCommentsIndex(emitMock)
      expect(totalPages.value).toBe(1)
    })
  })

  describe('ロジックの検証', (): void => {
    describe('fetchCommentList', (): void => {
      const mockResponse: CommentsResponse = {
        comments: [
          {
            id: 1,
            body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
            commenter: '工藤 琴音',
            department: '品質管理部',
            sample_id: 16,
            user_id: 1,
            updated_at: '2025-07-29T18:01:08.490Z',
          },
        ],
        current_page: 1,
        total_pages: 1
      }

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスがコメント一覧とページ情報であること', async () => {
          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })

          const {
            comments,
            currentPage,
            totalPages,
            fetchCommentList
          } = useCommentsIndex(emitMock)
          await fetchCommentList()

          expect(comments.value).toEqual(mockResponse.comments)
          expect(currentPage.value).toBe(mockResponse.current_page)
          expect(totalPages.value).toBe(mockResponse.total_pages)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async () => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })

          const { fetchCommentList } = useCommentsIndex(emitMock)
          await fetchCommentList()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'コメントリストの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound'})
        })
      })
    })
  })
})



