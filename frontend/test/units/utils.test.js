import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

vi.mock('axios')

describe('checkLoginStatus', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'dummy-token')
  })

  describe('レスポンスのステータスが 200 の場合', () => {
    it('onUnauthorized が呼ばれないこと', async () => {
      axios.get.mockResolvedValue({
        response: {
          status: 200
        }
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
  })

  describe('レスポンスのステータスが 401 の場合', () => {
    it('onUnauthorized が呼ばれること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 401
        }
      })

      const onUnauthorized = vi.fn()
      await checkLoginStatus(onUnauthorized)

      expect(onUnauthorized).toHaveBeenCalled()
    })
  })
})
