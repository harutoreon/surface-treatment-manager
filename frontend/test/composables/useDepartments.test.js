import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDepartments } from '@/composables/useDepartments.js'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

vi.mock('axios')
vi.mock('vue-router')

describe('useDepartments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ref の初期値', () => {
    it('departments の初期値は空の配列であること', () => {
      const { departments} = useDepartments()
      expect(departments.value).toEqual([])
    })

    it('department の初期値は空文字であること', () => {
      const { department } = useDepartments()
      expect(department.value).toBe('')
    })

    it('errorMessage の初期値は空文字であること', () => {
      const { errorMessage } = useDepartments()
      expect(errorMessage.value).toBe('')
    })

    it('name の初期値は空文字であること', () => {
      const { name } = useDepartments()
      expect(name.value).toBe('')
    })
  })

  describe('関数のロジック', () => {
    describe('fetchDepartmentList', () => {
      describe('リクエストに成功した場合', () => {
        it('部署の一覧が取得できること', async () => {
          vi.mocked(axios.get).mockResolvedValue({
            data: [
              { id: 1, name: '品質管理部' }
            ]
          })

          const { departments, fetchDepartmentList } = useDepartments()
          await fetchDepartmentList()

          expect(departments.value).toEqual([
            { id: 1, name: '品質管理部' }
          ])
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('message イベントが発火し、NotFound ルートへ遷移すること', async () => {
          const emitMock = vi.fn()
          const replaceMock = vi.fn()

          vi.mocked(useRouter).mockReturnValue({ replace: replaceMock })
          vi.mocked(axios.get).mockRejectedValue({
            response: {
              status: 404
            }
          })

          const { fetchDepartmentList } = useDepartments(emitMock)
          await fetchDepartmentList()

          expect(emitMock).toHaveBeenCalledWith(
            'message', { type: 'danger', text: '部署リストの取得に失敗しました。' },
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('fetchDepartmentData', () => {
      describe('リクエストに成功した場合', () => {
        it('部署の詳細が取得できること', async () => {
          vi.mocked(axios.get).mockResolvedValue({
            data: {
              id: 1,
              name: '品質管理部'
            }
          })

          const { department, fetchDepartmentData } = useDepartments()
          await fetchDepartmentData(1)

          expect(department.value).toEqual({
            id: 1, name: '品質管理部'
          })
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('message イベントが発火し、NotFound ルートへ遷移すること', async () => {
          const emitMock = vi.fn()
          const replaceMock = vi.fn()

          vi.mocked(useRouter).mockReturnValue({ replace: replaceMock })
          vi.mocked(axios.get).mockRejectedValue({
            response: {
              status: 404
            }
          })

          const { fetchDepartmentData } = useDepartments(emitMock)
          await fetchDepartmentData()

          expect(emitMock).toHaveBeenCalledWith(
            'message', { type: 'danger', text: '部署情報の取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('departmentRegistration', () => {
      describe('リクエストに成功した場合', () => {
        it('部署の登録に成功し、message イベントが発火して詳細ページに遷移すること', async () => {
          const emitMock = vi.fn()
          const pushMock = vi.fn()

          vi.mocked(useRouter).mockReturnValue({ push: pushMock })
          vi.mocked(axios.post).mockResolvedValue({
            data: {
              id: 1,
              name: '品質管理部'
            }
          })

          const { department, departmentRegistration } = useDepartments(emitMock)
          await departmentRegistration()

          expect(department.value).toEqual({ id: 1, name: '品質管理部' })
          expect(emitMock).toHaveBeenCalledWith(
            'message', { type: 'success', text: '部署を1件登録しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith('/departments/1')
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('エラーになること', async () => {
          vi.mocked(axios.post).mockRejectedValue({
            response: {
              status: 422
            }
          })

          const { errorMessage, departmentRegistration } = useDepartments()
          await departmentRegistration()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })

    describe('departmentUpdate', () => {
      describe('リクエストに成功した場合', () => {
        it('部署の更新に成功し、message イベントが発火して部署の詳細ページに遷移すること', async () => {
          const emitMock = vi.fn()
          const pushMock = vi.fn()

          vi.mocked(useRouter).mockReturnValue({ push: pushMock})
          vi.mocked(axios.patch).mockResolvedValue({
            data: {
              id: 1,
              name: '品質管理部'
            }
          })

          const { department, departmentUpdate } = useDepartments(emitMock)
          await departmentUpdate()

          expect(department.value).toEqual({ id: 1, name: '品質管理部' })
          expect(emitMock).toHaveBeenCalledWith(
            'message', { type: 'success', text: '部署情報を更新しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith('/departments/1')
        })
      })

      describe('リクエストに失敗した場合', () => {
        it('エラーになること', async () => {
          vi.mocked(axios.patch).mockRejectedValue({
            response: {
              status: 422
            }
          })

          const { errorMessage, departmentUpdate } = useDepartments()
          await departmentUpdate()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })

    describe('handleDelete', () => {
      afterEach(() => {
        vi.unstubAllGlobals()
      })

      describe('削除をキャンセルした場合', () => {
        it('false が返ること', async () => {
          const confirmMock = vi.fn().mockReturnValue(false)

          vi.stubGlobal('confirm', confirmMock)

          const { handleDelete } = useDepartments()
          await handleDelete()

          expect(confirmMock.mock.results[0].value).toBe(false)
        })
      })

      describe('削除を実行してリクエストに成功した場合', () => {
        it('部署の削除に成功し、message イベントが発火して部署の一覧ページに遷移すること', async () => {
          const confirmMock = vi.fn().mockReturnValue(true)
          const emitMock = vi.fn()
          const pushMock = vi.fn()

          vi.stubGlobal('confirm', confirmMock)
          vi.mocked(useRouter).mockReturnValue({ push: pushMock })
          vi.mocked(useRoute).mockReturnValue({ params: { id: 1 } })
          vi.mocked(axios.delete).mockResolvedValue({})

          const { handleDelete } = useDepartments(emitMock)
          await handleDelete()

          expect(confirmMock.mock.results[0].value).toBe(true)
          expect(emitMock).toHaveBeenCalledWith(
            'message', { type: 'success', text: '部署情報を1件削除しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith('/departments')
        })
      })

      describe('削除を実行してリクエストに失敗した場合', () => {
        it('message イベントが発火し、NotFound ルートへ遷移すること', async () => {
          const confirmMock = vi.fn().mockReturnValue(true)
          const emitMock = vi.fn()
          const replaceMock = vi.fn()

          vi.stubGlobal('confirm', confirmMock)
          vi.mocked(useRouter).mockReturnValue({ replace: replaceMock })
          vi.mocked(axios.delete).mockRejectedValue({
            response: {
              status: 404
            }
          })

          const { handleDelete } = useDepartments(emitMock)
          await handleDelete()

          expect(confirmMock.mock.results[0].value).toBe(true)
          expect(emitMock).toHaveBeenCalledWith(
            'message', { type: 'danger', text: '削除処理に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })
  })
})