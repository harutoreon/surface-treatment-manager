import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { useHome } from '@/composables/static_pages/useHome'
import type { LoggedInResponse } from '@/composables/static_pages/useHome'

vi.mock('axios')

describe('useHome', (): void => {
  const ADMIN_USER_ID: number = 49
  const GENERAL_USER_ID: number = 50

  const axiosGetResponse = (userId: number): void => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: { payload: { user_id: userId } }
    } as { data: LoggedInResponse })
  }

  beforeEach((): void => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('初期状態の検証', (): void => {
    it('isAdmin の初期値が false であること', (): void => {
      const { isAdmin } = useHome()
      expect(isAdmin.value).toBe(false)
    })

    it('containerSize の初期値が空文字であること', (): void => {
      const { containerSize } = useHome()
      expect(containerSize.value).toBe('')
    })
  })

  describe('ビジネスロジックの実行結果', (): void => {
    beforeEach((): void => {
      localStorage.setItem('token', 'test-token')
    })

    describe('管理者ユーザーの場合', (): void => {
      beforeEach((): void => {
        axiosGetResponse(ADMIN_USER_ID)
      })

      it('isAdmin が true になること', async (): Promise<void> => {
        const { isAdmin, handleLogin } = useHome()
        await handleLogin()

        expect(isAdmin.value).toBe(true)
      })

      it('containerSize が "container w-50" になること', async (): Promise<void> => {
        const { containerSize, handleLogin } = useHome()
        await handleLogin()

        expect(containerSize.value).toBe('container w-50')
      })
    })

    describe('一般ユーザーの場合', (): void => {
      beforeEach((): void => {
        axiosGetResponse(GENERAL_USER_ID)
      })

      it('isAdmin が false になること', async (): Promise<void> => {
        const { isAdmin, handleLogin } = useHome()
        await handleLogin()

        expect(isAdmin.value).toBe(false)
      })

      it('containerSize が "container w-75" になること', async (): Promise<void> => {
        const { containerSize, handleLogin } = useHome()
        await handleLogin()

        expect(containerSize.value).toBe('container w-75')
      })
    })
  })

  describe('外部通信のハンドリング', (): void => {
    it('正しいエンドポイントに GET リクエストを送信すること', async (): Promise<void> => {
      axiosGetResponse(GENERAL_USER_ID)

      localStorage.setItem('token', 'test-token')

      const { handleLogin } = useHome()
      await handleLogin()

      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/logged_in'),
        expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } })
      )
    })
  })

  describe('副作用の実行', (): void => {
    beforeEach((): void => {
      axiosGetResponse(GENERAL_USER_ID)
    })

    it('handleLogin 実行時に localStorage から token を取得する', async (): Promise<void> => {
      const getItemSpy = vi.spyOn(localStorage, 'getItem')
      localStorage.setItem('token', 'test-token-123')

      const { handleLogin } = useHome()
      await handleLogin()

      expect(getItemSpy).toHaveBeenCalledWith('token')
      expect(getItemSpy).toHaveBeenCalledTimes(1)
    })
  })
})
