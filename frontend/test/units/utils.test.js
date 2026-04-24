// 副作用 (Side Effects) の実行

import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

vi.mock('axios')

describe('checkLoginStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'dummy-token')
  })

  describe('レスポンスのステータスが200の場合', () => {
    it('Authorization ヘッダーが呼ばれること', async () => {
      vi.mocked(axios).get.mockResolvedValue({ status: 200 })

      const onUnauthorized = vi.fn()
      await checkLoginStatus(onUnauthorized)

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/logged_in'),
        expect.objectContaining({
          headers: { Authorization: 'Bearer dummy-token' }
        })
      )
    })

    it('trueが返ること', async () => {
      vi.mocked(axios).get.mockResolvedValue({ status: 200 })

      const onUnauthorized = vi.fn()
      const loggedIn = await checkLoginStatus(onUnauthorized)

      expect(loggedIn).toBe(true)
    })
  })

  describe('レスポンスのステータスが401の場合', () => {
    it('onUnauthorizedを渡さなくてもエラーにならないこと', async () => {
      vi.mocked(axios).get.mockRejectedValue({ response: { status: 401 } })

      const loggedIn = await checkLoginStatus()

      expect(loggedIn).toBe(false)
    })

    it('onUnauthorizedが呼ばれること', async () => {
      vi.mocked(axios).get.mockRejectedValue({ response: { status: 401 } })

      const onUnauthorized = vi.fn()
      await checkLoginStatus(onUnauthorized)

      expect(onUnauthorized).toHaveBeenCalled()
    })

    it('falseが返ること', async () => {
      vi.mocked(axios).get.mockRejectedValue({ response: { status: 401 } })

      const onUnauthorized = vi.fn()
      const loggedIn = await checkLoginStatus(onUnauthorized)

      expect(loggedIn).toBe(false)
    })
  })
})
