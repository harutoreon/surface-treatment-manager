import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.ts'

vi.mock('axios')

describe('checkLoginStatus', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'dummy-token')
  })

  describe('レスポンスのステータスが 200 の場合', (): void => {
    beforeEach((): void => {
      vi.mocked(axios).get.mockResolvedValue({ status: 200 })
    })

    it('Authorization ヘッダーが呼ばれること', async (): Promise<void> => {
      const onUnauthorized = vi.fn()
      await checkLoginStatus(onUnauthorized)

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/logged_in'),
        expect.objectContaining({
          headers: { Authorization: 'Bearer dummy-token' }
        })
      )
    })

    it('true が返ること', async (): Promise<void> => {
      const onUnauthorized = vi.fn()
      const loggedIn = await checkLoginStatus(onUnauthorized)

      expect(loggedIn).toBe(true)
    })
  })

  describe('レスポンスのステータスが 401 の場合', (): void => {
    beforeEach((): void => {
      vi.mocked(axios).get.mockRejectedValue({ response: { status: 401 } })
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
    })

    it('onUnauthorized を渡さなくてもエラーにならないこと', async (): Promise<void> => {
      const loggedIn = await checkLoginStatus()
      expect(loggedIn).toBe(false)
    })

    it('onUnauthorized が呼ばれること', async (): Promise<void> => {
      const onUnauthorized = vi.fn()

      await checkLoginStatus(onUnauthorized)

      expect(onUnauthorized).toHaveBeenCalled()
    })

    it('false が返ること', async (): Promise<void> => {
      const onUnauthorized = vi.fn()
      const loggedIn = await checkLoginStatus(onUnauthorized)

      expect(loggedIn).toBe(false)
    })
  })
})
