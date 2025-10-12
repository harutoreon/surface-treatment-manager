import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

vi.mock('axios')

describe('checkLoginStatus', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'dummy-token')
  })

  describe('レスポンスのステータスが200の場合', () => {
    it('onUnauthorizedが呼ばれないこと', async () => {
      axios.get.mockResolvedValue({
        status: 200
      })

      const onUnauthorized = vi.fn()
      await checkLoginStatus(onUnauthorized)

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/logged_in'),
        expect.objectContaining({
          headers: { Authorization: 'Bearer dummy-token' }
        })
      )
      expect(onUnauthorized).not.toHaveBeenCalled()
    })

    it('trueが返ること', async () => {
      axios.get.mockResolvedValue({
        status: 200
      })

      const onUnauthorized = vi.fn()
      const loggedIn = await checkLoginStatus(onUnauthorized)

      expect(loggedIn).toBe(true)
    })
  })

  describe('レスポンスのステータスが401の場合', () => {
    it('onUnauthorizedが呼ばれること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
        }
      })

      const onUnauthorized = vi.fn()
      await checkLoginStatus(onUnauthorized)

      expect(onUnauthorized).toHaveBeenCalled()
    })

    it('falseが返ること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
        }
      })

      const onUnauthorized = vi.fn()
      const loggedIn = await checkLoginStatus(onUnauthorized)

      expect(loggedIn).toBe(false)
    })
  })
})
