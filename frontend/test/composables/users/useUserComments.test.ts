import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserComments } from '@/composables/users/useUserComments.ts'
import type { Comment, Emit } from '@/composables/users/useUserComments.ts'
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

describe('useUserComments', (): void => {
  const emitMock: Emit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('userComments の初期値が空の配列であること', (): void => {
      const { userComments } = useUserComments(emitMock)
      expect(userComments.value).toEqual([])
    })
  })

  describe('ロジックの検証', (): void => {
    describe('fetchUserComments', (): void => {
      const mockResponse: Comment[] = [
        {
          id: 1,
          body: 'sample body',
          commenter: 'sample commenter',
          department: 'sample department',
          sample_id: 1,
          user_id: 1,
        },
      ]

      describe('リクエストに成功した場合', (): void => {
        it('レスポンスはユーザーのコメントリストであること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })
          const { userComments, fetchUserComments } = useUserComments(emitMock)
          await fetchUserComments(`${mockResponse[0].user_id}`)

          expect(userComments.value).toEqual(mockResponse)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })

          const { fetchUserComments } = useUserComments(emitMock)
          await fetchUserComments(`${mockResponse[0].user_id}`)

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'コメントリストの取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })
  })
})
