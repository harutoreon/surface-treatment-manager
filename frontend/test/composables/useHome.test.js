import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { useHome } from '@/composables/useHome.js'

vi.mock('axios')

describe('useHome', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('初期状態の検証', () => {
    it('isAdmin の初期値が false であること', () => {
      const { isAdmin } = useHome()
      expect(isAdmin.value).toBe(false)
    })

    it('containerSize の初期値が空文字であること', () => {
      const { containerSize } = useHome()
      expect(containerSize.value).toBe('')
    })
  })

  describe('ビジネスロジックの実行結果', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'test-token')
    })

    describe('管理者ユーザーの場合', () => {
      const ADMIN_USER_ID = 49

      beforeEach(() => {
        vi.mocked(axios).get.mockResolvedValue({
          data: { payload: { user_id: ADMIN_USER_ID} }
        })
      })

      it('isAdmin が true になること', async () => {
        const { isAdmin, handleLogin } = useHome()
        await handleLogin()

        expect(isAdmin.value).toBe(true)
      })

      it('containerSize が "container w-50" になること', async () => {
        const { containerSize, handleLogin } = useHome()
        await handleLogin()

        expect(containerSize.value).toBe('container w-50')
      })
    })

    describe('一般ユーザーの場合', () => {
      const GENERAL_USER_ID = 1

      beforeEach(() => {
        vi.mocked(axios).get.mockResolvedValue({
          data: { payload: { user_id: GENERAL_USER_ID } }
        })
      })

      it('isAdmin が false になること', async () => {
        const { isAdmin, handleLogin } = useHome()
        await handleLogin()

        expect(isAdmin.value).toBe(false)
      })

      it('containerSize が "container w-75" になること', async () => {
        const { containerSize, handleLogin } = useHome()
        await handleLogin()

        expect(containerSize.value).toBe('container w-75')
      })
    })
  })

  describe('外部通信のハンドリング', () => {
    it('正しいエンドポイントに GET リクエストを送信すること', async () => {
      vi.mocked(axios).get.mockResolvedValue({
        data: { payload: { user_id: 1 } }
      })

      localStorage.setItem('token', 'test-token')

      const { handleLogin } = useHome()
      await handleLogin()

      expect(axios.get).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/logged_in`,
        {
          headers: {
            Authorization: 'Bearer test-token'
          }
        }
      )
      expect(axios.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('副作用の実行', () => {
    beforeEach(() => {
      vi.mocked(axios).get.mockResolvedValue({
        data: { payload: { user_id: 1 } }
      })
    })

    it('handleLogin 実行時に localStorage から token を取得する', async () => {
      const getItemSpy = vi.spyOn(localStorage, 'getItem')
      localStorage.setItem('token', 'test-token-123')

      const { handleLogin } = useHome()
      await handleLogin()

      expect(getItemSpy).toHaveBeenCalledWith('token')
      expect(getItemSpy).toHaveBeenCalledTimes(1)
    })
  })
})
