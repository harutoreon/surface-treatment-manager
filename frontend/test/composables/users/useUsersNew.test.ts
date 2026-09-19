import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUsersNew } from '@/composables/users/useUsersNew'
import type { MessageEmit } from '@/env'
import type { UserResponse, DepartmentResponse } from '@/composables/users/useUsersNew'
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

describe('useUsersNew', (): void => {
  const emitMock: MessageEmit = vi.fn()

  const departmentMockResponse: DepartmentResponse[] = [
    { id: 1, name: '品質管理部' }
  ]

  const userMockResponse: UserResponse = {
    id: 1,
    name: 'test user',
    department: 'test department',
  }

  beforeEach((): void => {
    vi.resetAllMocks()
  })

  describe('初期値の検証', (): void => {
    it('newUser の初期値が null であること', (): void => {
      const { newUser } = useUsersNew(emitMock)
      expect(newUser.value).toBe(null)
    })

    it('name の初期値が空文字であること', (): void => {
      const { name } = useUsersNew(emitMock)
      expect(name.value).toBe('')
    })

    it('department の初期値が空文字であること', (): void => {
      const { department } = useUsersNew(emitMock)
      expect(department.value).toBe('')
    })

    it('password の初期値が空文字であること', (): void => {
      const { password } = useUsersNew(emitMock)
      expect(password.value).toBe('')
    })

    it('passwordConfirmation の初期値が空文字であること', (): void => {
      const { passwordConfirmation } = useUsersNew(emitMock)
      expect(passwordConfirmation.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', (): void => {
      const { errorMessage } = useUsersNew(emitMock)
      expect(errorMessage.value).toBe('')
    })

    it('departmentOptions の初期値が空の配列であること', (): void => {
      const { departmentOptions } = useUsersNew(emitMock)
      expect(departmentOptions.value).toEqual([])
    })
  })

  describe('fetchDepartments', (): void => {
    describe('レスポンスに成功した場合', (): void => {
      it('レスポンスは部署リストであること', async (): Promise<void> => {
        vi.mocked(axios.get).mockResolvedValueOnce({ data: departmentMockResponse })

        const { departmentOptions, fetchDepartments } = useUsersNew(emitMock)
        await fetchDepartments()

        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/departments'))
        expect(departmentOptions.value).toEqual(departmentMockResponse)
      })
    })

    describe('レスポンスに失敗した場合', (): void => {
      it('レスポンスはエラーメッセージを含み、NotFound ルートの呼び出しがあること', async (): Promise<void> => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

        const { fetchDepartments } = useUsersNew(emitMock)
        await fetchDepartments()

        expect(emitMock).toHaveBeenCalledWith(
          'message',
          { type: 'danger', text: '部署名の取得に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })

  describe('userRegistration', (): void => {
    describe('リクエストに成功した場合', (): void => {
      it('レスポンスにユーザー情報を含み、ユーザー情報ページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.post).mockResolvedValueOnce({ data: userMockResponse })

        const {
          name,
          department,
          password,
          passwordConfirmation,
          userRegistration
        } = useUsersNew(emitMock)

        name.value = 'test user'
        department.value = 'test department'
        password.value = 'password'
        passwordConfirmation.value = 'password'

        await userRegistration()

        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/users'),
          {
            user: {
              name: 'test user',
              department: 'test department',
              password: 'password',
              password_confirmation: 'password'
            }
          }
        )
        expect(emitMock).toHaveBeenCalledWith(
          'message',
          { type: 'success', text: 'ユーザー情報を登録しました。' }
        )
        expect(pushMock).toHaveBeenCalledWith(`/users/${userMockResponse.id}`)
      })
    })

    describe('リクエストに失敗した場合', (): void => {
      it('バリデーションエラーになること', async (): Promise<void> => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.post).mockRejectedValueOnce({ response: { status: 404 } })

        const { errorMessage, userRegistration } = useUsersNew(emitMock)
        await userRegistration()

        expect(errorMessage.value).toBe('入力に不備があります。')
      })
    })
  })
})
