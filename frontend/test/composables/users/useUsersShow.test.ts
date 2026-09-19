import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUsersShow } from '@/composables/users/useUsersShow'
import type { MessageEmit } from '@/env'
import type { UserResponse } from '@/composables/users/useUsersShow'
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

describe('useUsers', (): void => {
  const emitMock: MessageEmit = vi.fn()

  beforeEach((): void=> {
    vi.resetAllMocks()
  })

  describe('変数の初期値', (): void => {
    it('user の初期値が空文字であること', (): void => {
      const { user } = useUsersShow(emitMock)
      expect(user.value).toBe(null)
    })
  })

  describe('fetchUserInformation()', (): void => {
    const userId: string = '1'

    describe('リクエストに成功した場合', (): void => {
      it('レスポンスはユーザー情報であること', async (): Promise<void> => {
        const mockResponse: UserResponse = {
          id: 1,
          name: 'test user',
          department: 'test department',
          admin: true,
        }

        vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })

        const { user, fetchUserData } = useUsersShow(emitMock)
        await fetchUserData(userId)

        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining(`/users/${mockResponse.id}`)
        )
        expect(user.value).toEqual(mockResponse)
      })
    })

    describe('リクエストに失敗した場合', (): void => {
      it('レスポンスにエラーメッセージを含み、NotFound ルートの呼び出しがあること', async (): Promise<void> => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

        const { fetchUserData } = useUsersShow(emitMock)
        await fetchUserData(userId)

        expect(emitMock).toHaveBeenCalledWith(
          'message',
          { type: 'danger', text: 'ユーザー情報の取得に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
