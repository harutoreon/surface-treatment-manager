import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUsersEdit } from '@/composables/users/useUsersEdit'
import type { MessageEmit } from '@/env'
import type { UserResponse } from '@/composables/users/useUsersEdit'
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
    it('user の初期値が null であること', (): void => {
      const { user } = useUsersEdit(emitMock)
      expect(user.value).toBeNull()
    })

    it('password の初期値が空文字であること', (): void => {
      const { password } = useUsersEdit(emitMock)
      expect(password.value).toBe('')
    })

    it('passwordConfirmation の初期値が空文字であること', (): void => {
      const { passwordConfirmation } = useUsersEdit(emitMock)
      expect(passwordConfirmation.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', (): void => {
      const { errorMessage } = useUsersEdit(emitMock)
      expect(errorMessage.value).toBe('')
    })
  })

  describe('userUpdate()', (): void => {
    const getMockResponse: UserResponse = {
      id: 1,
      name: 'test update user',
      department: 'test update department'
    }

    describe('リクエストに成功した場合', (): void => {
      it('レスポンスにユーザー情報を含み、ユーザー情報ページに遷移すること', async (): Promise<void> => {
        const patchMockResponse: UserResponse = {
          id: 1,
          name: 'test update user',
          department: 'test update department',
        }

        vi.mocked(axios.patch).mockResolvedValueOnce({ data: patchMockResponse })

        const { user, userUpdate } = useUsersEdit(emitMock)
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

        const { user, errorMessage, userUpdate } = useUsersEdit(emitMock)
        user.value = getMockResponse

        await userUpdate()

        expect(axios.patch).toHaveBeenCalled()
        expect(errorMessage.value).toBe('入力に不備があります。')
      })
    })
  })
})
