import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUsersIndex } from '@/composables/users/useUsersIndex'
import type { MessageEmit } from '@/env'
import type { UsersResponse } from '@/composables/users/useUsersIndex'
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

describe('useUsersIndex', (): void => {
  const emitMock: MessageEmit = vi.fn()

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('変数の初期値', (): void => {
    it('users の初期値が空の配列であること', (): void => {
      const { users } = useUsersIndex(emitMock)
      expect(users.value).toEqual([])
    })

    it('currentPage の初期値が数値の 1 であること', (): void => {
      const { currentPage } = useUsersIndex(emitMock)
      expect(currentPage.value).toBe(1)
    })

    it('totalPages の初期値が数値の 1 であること', (): void => {
      const { totalPages } = useUsersIndex(emitMock)
      expect(totalPages.value).toBe(1)
    })
  })


  describe('fetchUserList()', (): void => {
    describe('リクエストが成功した場合', (): void => {
      it('レスポンスはユーザーリストとページ情報であること', async (): Promise<void> => {
        const mockResponse: UsersResponse = {
          users: [
            { id: 1, name: 'test user', department: 'test department', admin: true },
          ],
          current_page: 1,
          total_pages: 1
        }

        vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })

        const {
          users,
          currentPage,
          totalPages,
          fetchUserList
        } = useUsersIndex(emitMock)

        await fetchUserList()

        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/users'),
          { params: { page: 1 } }
        )
        expect(users.value).toEqual(mockResponse.users)
        expect(currentPage.value).toBe(mockResponse.current_page)
        expect(totalPages.value).toBe(mockResponse.total_pages)
      })
    })

    describe('リクエストが失敗した場合', (): void => {
      it('レスポンスにエラーメッセージを含み、NotFound ルートの呼び出しがあること', async (): Promise<void> => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

        const { fetchUserList } = useUsersIndex(emitMock)
        await fetchUserList()

        expect(emitMock).toHaveBeenCalledWith(
          'message',
          { text: 'ユーザーリストの取得に失敗しました。', type: 'danger' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
