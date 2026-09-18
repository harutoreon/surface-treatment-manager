import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDepartments } from '@/composables/departments/useDepartments'
import axios from 'axios'
import type { MessageEmit } from '@/env'
import type { Department } from '@/composables/departments/useDepartments'

const { pushMock, replaceMock } = vi.hoisted(() => {
  return {
    pushMock: vi.fn(),
    replaceMock: vi.fn(),
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
        push: pushMock,
        replace: replaceMock,
      }
    }
  }
})

describe('useDepartments', (): void => {
  const emitMock: MessageEmit = vi.fn()

  const mockDepartment: Department = {
    id: 1,
    name: '品質管理部'
  }

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('ref の初期値', (): void => {
    it('departments の初期値は空の配列であること', (): void => {
      const { departments} = useDepartments(emitMock)
      expect(departments.value).toEqual([])
    })

    it('department の初期値は空文字であること', (): void => {
      const { department } = useDepartments(emitMock)
      expect(department.value).toBe(null)
    })

    it('errorMessage の初期値は空文字であること', (): void => {
      const { errorMessage } = useDepartments(emitMock)
      expect(errorMessage.value).toBe('')
    })

    it('name の初期値は空文字であること', (): void => {
      const { name } = useDepartments(emitMock)
      expect(name.value).toBe('')
    })
  })

  describe('関数のロジック', (): void => {
    describe('fetchDepartmentList', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('部署の一覧が取得できること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValueOnce({ data: [mockDepartment] })

          const { departments, fetchDepartmentList } = useDepartments(emitMock)
          await fetchDepartmentList()

          expect(departments.value).toEqual([mockDepartment])
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('message イベントが発火し、NotFound ルートへ遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

          const { fetchDepartmentList } = useDepartments(emitMock)
          await fetchDepartmentList()

          expect(emitMock).toHaveBeenCalledWith(
            'message', { type: 'danger', text: '部署リストの取得に失敗しました。' },
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('fetchDepartmentData', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('部署の詳細が取得できること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockDepartment })

          const { department, fetchDepartmentData } = useDepartments(emitMock)
          await fetchDepartmentData('1')

          expect(department.value).toEqual(mockDepartment)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('message イベントが発火し、NotFound ルートへ遷移すること', async (): Promise<void> => {
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

          const { fetchDepartmentData } = useDepartments(emitMock)
          await fetchDepartmentData('1')

          expect(emitMock).toHaveBeenCalledWith(
            'message', { type: 'danger', text: '部署情報の取得に失敗しました。' }
          )
          expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
        })
      })
    })

    describe('departmentRegistration', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('部署の登録に成功し、message イベントが発火して詳細ページに遷移すること', async (): Promise<void> => {
          vi.mocked(axios.post).mockResolvedValueOnce({ data: mockDepartment })

          const { name, department, departmentRegistration } = useDepartments(emitMock)
          await departmentRegistration()

          expect(department.value).toEqual(mockDepartment)
          expect(emitMock).toHaveBeenCalledWith(
            'message', { type: 'success', text: '部署を1件登録しました。' }
          )
          expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/departments'),
            expect.objectContaining({ department: { name: name.value } })
          )
          expect(pushMock).toHaveBeenCalledWith(`/departments/${mockDepartment.id}`)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('エラーになること', async (): Promise<void> => {
          vi.mocked(axios.post).mockRejectedValueOnce({ response: { status: 422 } })

          const { errorMessage, departmentRegistration } = useDepartments(emitMock)
          await departmentRegistration()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })

    describe('departmentUpdate', (): void => {
      describe('リクエストに成功した場合', (): void => {
        it('部署の更新に成功し、message イベントが発火して部署の詳細ページに遷移すること', async (): Promise<void> => {
          const updateMockDepartment = { id: 1, name: '品質保証部' }

          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockDepartment })
          vi.mocked(axios.patch).mockResolvedValueOnce({ data: updateMockDepartment })

          const { department, fetchDepartmentData, departmentUpdate } = useDepartments(emitMock)
          await fetchDepartmentData('1')
          await departmentUpdate()

          expect(department.value).toEqual(updateMockDepartment)
          expect(emitMock).toHaveBeenCalledWith(
            'message', { type: 'success', text: '部署情報を更新しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith(`/departments/${updateMockDepartment.id}`)
        })
      })

      describe('リクエストに失敗した場合', (): void => {
        it('エラーになること', async (): Promise<void> => {
          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockDepartment })
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.patch).mockRejectedValueOnce({ response: { status: 422 } })

          const { errorMessage, fetchDepartmentData, departmentUpdate } = useDepartments(emitMock)
          await fetchDepartmentData('1')
          await departmentUpdate()

          expect(errorMessage.value).toBe('入力に不備があります。')
        })
      })
    })

    describe('handleDelete', (): void => {
      afterEach((): void => {
        vi.unstubAllGlobals()
      })

      describe('削除をキャンセルした場合', (): void => {
        it('false が返ること', async (): Promise<void> => {
          const confirmMock = vi.fn().mockReturnValue(false)

          vi.stubGlobal('confirm', confirmMock)

          const { handleDelete } = useDepartments(emitMock)
          await handleDelete()

          expect(confirmMock.mock.results[0].value).toBe(false)
        })
      })

      describe('削除を実行してリクエストに成功した場合', (): void => {
        it('部署の削除に成功し、message イベントが発火して部署の一覧ページに遷移すること', async (): Promise<void> => {
          const confirmMock = vi.fn().mockReturnValue(true)

          vi.stubGlobal('confirm', confirmMock)
          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockDepartment })
          vi.mocked(axios.delete).mockResolvedValueOnce({})

          const { fetchDepartmentData, handleDelete } = useDepartments(emitMock)
          await fetchDepartmentData('1')
          await handleDelete()

          expect(confirmMock.mock.results[0].value).toBe(true)
          expect(emitMock).toHaveBeenCalledWith(
            'message',
            { type: 'success', text: '部署情報を1件削除しました。' }
          )
          expect(pushMock).toHaveBeenCalledWith('/departments')
        })
      })

      describe('削除を実行してリクエストに失敗した場合', (): void => {
        it('message イベントが発火し、NotFound ルートへ遷移すること', async (): Promise<void> => {
          const confirmMock = vi.fn().mockReturnValue(true)

          vi.stubGlobal('confirm', confirmMock)
          vi.mocked(axios.isAxiosError).mockReturnValue(true)
          vi.mocked(axios.get).mockResolvedValueOnce({ data: mockDepartment })
          vi.mocked(axios.delete).mockRejectedValueOnce({ response: { status: 404 } })

          const { fetchDepartmentData, handleDelete } = useDepartments(emitMock)
          await fetchDepartmentData('1')
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
