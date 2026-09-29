import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUsersEdit } from '@/composables/users/useUsersEdit'
import { useUsersShow } from '@/composables/users/useUsersShow'
import type { MessageEmit } from '@/env'
import type { UserResponse } from '@/composables/users/useUsersShow'
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

describe('useUsersEdit', (): void => {
  const emitMock: MessageEmit = vi.fn()

  beforeEach((): void => {
    vi.resetAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('password の初期値が空文字であること', (): void => {
      const { user } = useUsersShow(emitMock)
      const { password } = useUsersEdit(emitMock, user)

      expect(password.value).toBe('')
    })

    it('passwordConfirmation の初期値が空文字であること', (): void => {
      const { user } = useUsersShow(emitMock)
      const { passwordConfirmation } = useUsersEdit(emitMock, user)

      expect(passwordConfirmation.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', (): void => {
      const { user } = useUsersShow(emitMock)
      const { errorMessage } = useUsersEdit(emitMock, user)

      expect(errorMessage.value).toBe('')
    })
  })

  describe('userUpdate()', (): void => {
    const getMockResponse: UserResponse = {
      id: 1,
      name: 'test update user',
      department: 'test update department',
      admin: false
    }

    describe('リクエストに成功した場合', (): void => {
      it('レスポンスにユーザー情報を含み、ユーザー情報ページに遷移すること', async (): Promise<void> => {
        const patchMockResponse: UserResponse = {
          id: 1,
          name: 'test update user',
          department: 'test update department',
          admin: false
        }

        vi.mocked(axios.patch).mockResolvedValueOnce({ data: patchMockResponse })

        const { user } = useUsersShow(emitMock)
        const { userUpdate } = useUsersEdit(emitMock, user)
        user.value = getMockResponse

        await userUpdate()

        expect(axios.patch).toHaveBeenCalledWith(
          expect.stringContaining('/users/1'),
          {
            user:{
              name: 'test update user',
              department: 'test update department',
            }
          }
        )
        expect(emitMock).toHaveBeenLastCalledWith(
          'message',
          { type: 'success', text: 'ユーザー情報を更新しました。' }
        )
        expect(pushMock).toHaveBeenCalledWith(`/users/${patchMockResponse.id}`)
      })
    })

    describe('リクエストに失敗した場合', (): void => {
      it('バリデーションエラーになること', async (): Promise<void> => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.patch).mockRejectedValueOnce({ response: { status: 422 } })

        const { user } = useUsersShow(emitMock)
        const { errorMessage, userUpdate } = useUsersEdit(emitMock, user)
        user.value = getMockResponse

        await userUpdate()

        expect(axios.patch).toHaveBeenCalled()
        expect(errorMessage.value).toBe('入力に不備があります。')
      })
    })
  })
})
