import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useUsers } from '@/composables/useUsers.js'
import axios from 'axios'
import { useRouter } from 'vue-router'

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: 1 },
        params: { params: { id: 1} }
      }
    },
    useRouter: vi.fn()
  }
})

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期値の検証', () => {
    it('users の初期値が空の配列であること', () => {
      const { users } = useUsers()
      expect(users.value).toEqual([])
    })

    it('user の初期値が空文字であること', () => {
      const { user } = useUsers()
      expect(user.value).toBe('')
    })

    it('currentPage の初期値が数値の 1 であること', () => {
      const { currentPage } = useUsers()
      expect(currentPage.value).toBe(1)
    })

    it('totalPages の初期値が数値の 1 であること', () => {
      const { totalPages } = useUsers()
      expect(totalPages.value).toBe(1)
    })

    it('options の初期値が空の配列であること', () => {
      const { options } = useUsers()
      expect(options.value).toEqual([])
    })

    it('name の初期値が空文字であること', () => {
      const { name } = useUsers()
      expect(name.value).toBe('')
    })

    it('department の初期値が空文字であること', () => {
      const { department } = useUsers()
      expect(department.value).toBe('')
    })

    it('password の初期値が空文字であること', () => {
      const { password } = useUsers()
      expect(password.value).toBe('')
    })

    it('password_confirmation の初期値が空文字であること', () => {
      const { password_confirmation } = useUsers()
      expect(password_confirmation.value).toBe('')
    })

    it('errorMessage の初期値が空文字であること', () => {
      const { errorMessage } = useUsers()
      expect(errorMessage.value).toBe('')
    })
  })

  describe('ロジックの検証', () => {
    describe('fetchUserList', () => {
      describe('リクエストが成功した場合', () => {
        it('レスポンスはユーザーリストとページ情報であること', async () => {
          vi.mocked(axios.get).mockResolvedValue({
            data: {
              users: [
                { id: 1, name: 'test user', department: 'test department' },
              ],
              current_page: 1,
              total_pages: 1
            }
          })

          const {
            users,
            currentPage,
            totalPages,
            fetchUserList
          } = useUsers()

          await fetchUserList()

          expect(users.value).toEqual([
            { id: 1, name: 'test user', department: 'test department' }
          ])
          expect(currentPage.value).toBe(1)
          expect(totalPages.value).toBe(1)
        })
      })

      describe('リクエストが失敗した場合', () => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートの呼び出しがあること', async () => {
          const emitMock = vi.fn()
          const replaceMock = vi.fn()

          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })
          vi.mocked(useRouter).mockReturnValue({ replace: replaceMock })

          const { fetchUserList } = useUsers(emitMock)
          await fetchUserList()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { text: 'ユーザーリストの取得に失敗しました。', type: 'danger' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('fetchUserInformation', () => {
      describe('リクエストに成功した場合', () => {
        it('レスポンスはユーザー情報であること', async () => {
          const mockResponse = {
            id: 1,
            name: 'test user',
            department: 'test department'
          }

          vi.mocked(axios.get).mockResolvedValue({ data: mockResponse })

          const { user, fetchUserInformation } = useUsers()
          await fetchUserInformation(mockResponse.id)

          expect(user.value).toEqual(mockResponse)
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('レスポンスにエラーメッセージを含み、NotFound ルートの呼び出しがあること', async () => {
          const emitMock = vi.fn()
          const replaceMock = vi.fn()
          const userId = 1

          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })
          vi.mocked(useRouter).mockReturnValue({ replace: replaceMock })

          const { fetchUserInformation } = useUsers(emitMock)
          await fetchUserInformation(userId)

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'ユーザー情報の取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('fetchDepartments', () => {
      describe('レスポンスに成功した場合', () => {
        it('レスポンスは部署リストであること', async () => {
          vi.mocked(axios.get).mockResolvedValue({
            data: [
              { id: 1, name: '品質管理部' }
            ]
          })

          const { options, fetchDepartments } = useUsers()
          await fetchDepartments()

          expect(options.value).toEqual([
            { id: 1, name: '品質管理部' }
          ])
        })
      })

      describe('レスポンスに失敗した場合', () => {
        it('レスポンスはエラーメッセージを含み、NotFound ルートの呼び出しがあること', async () => {
          const emitMock = vi.fn()
          const replaceMock = vi.fn()

          vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } })
          vi.mocked(useRouter).mockReturnValue({ replace: replaceMock })

          const { fetchDepartments } = useUsers(emitMock)
          await fetchDepartments()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: '部署名の取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('userRegistration', () => {
      describe('リクエストに成功した場合', () => {
        it('レスポンスにユーザー情報を含み、ユーザー情報ページに遷移すること', async () => {
          const emitMock = vi.fn()
          const pushMock = vi.fn()

          const mockResponse = {
            id: 1,
            name: 'test user',
            department: 'test department',
          }

          vi.mocked(axios.post).mockResolvedValue({ data: mockResponse })
          vi.mocked(useRouter).mockReturnValue({ push: pushMock })

          const { user, userRegistration } = useUsers(emitMock)
          await userRegistration()

          expect(user.value).toEqual(mockResponse)
          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'ユーザー情報を登録しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith(`/users/${mockResponse.id}`)
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('バリデーションエラーになること', async () => {
          vi.mocked(axios.post).mockRejectedValue({ response: { status: 404 } })

          const { errorMessage, userRegistration } = useUsers()
          await userRegistration()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })

    describe('userUpdate', () => {
      describe('リクエストに成功した場合', () => {
        it('レスポンスにユーザー情報を含み、ユーザー情報ページに遷移すること', async () => {
          const emitMock = vi.fn()
          const pushMock = vi.fn()

          const mockResponse = {
            id: 1,
            name: 'test user',
            department: 'test department',
          }

          vi.mocked(axios.patch).mockResolvedValue({ data: mockResponse })
          vi.mocked(useRouter).mockReturnValue({ push: pushMock })

          const { user, userUpdate } = useUsers(emitMock)
          await userUpdate(mockResponse.id)

          expect(user.value).toEqual(mockResponse)
          expect(emitMock).toHaveBeenLastCalledWith(
            'message',
            { type: 'success', text: 'ユーザー情報を更新しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith(`/users/${mockResponse.id}`)
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('バリデーションエラーになること', async () => {
          const userId = 1

          vi.mocked(axios.patch).mockRejectedValue({ response: { status: 422 } })

          const { errorMessage, userUpdate } = useUsers()
          await userUpdate(userId)

          expect(errorMessage.value).toBe('入力に不備があります。')
        })        
      })
    })

    describe('handleDelete', () => {
      beforeEach(() => {
        vi.stubGlobal('confirm', vi.fn(() => true))
      })

      afterEach(() => {
        vi.unstubAllGlobals
      })

      describe('リクエストに成功した場合', () => {
        it('ユーザーリストページに遷移すること', async () => {
          const emitMock = vi.fn()
          const pushMock = vi.fn()

          vi.mocked(axios.delete).mockResolvedValue({})
          vi.mocked(useRouter).mockReturnValue({ push: pushMock })

          const { handleDelete } = useUsers(emitMock)
          await handleDelete()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: 'ユーザー情報を削除しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith('/users')
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('NotFound ルートに遷移すること', async () => {
          const emitMock = vi.fn()
          const replaceMock = vi.fn()

          vi.mocked(axios.delete).mockRejectedValue({ response: { status: 404 } })
          vi.mocked(useRouter).mockReturnValue({ replace: replaceMock })

          const { handleDelete } = useUsers(emitMock)
          await handleDelete()

          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'danger', text: 'ユーザー情報の削除に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })
  })
})
