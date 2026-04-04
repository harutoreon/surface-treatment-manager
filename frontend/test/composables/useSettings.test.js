import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSettings } from '@/composables/useSettings.js'
import axios from 'axios'

const pushMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('logout', () => {
    it('実行するとlocalStorageが削除され、トップページに遷移すること', () => {
      localStorage.setItem('token', 'fake-token')
      expect(localStorage.getItem('token')).toBe('fake-token')

      const { logout } = useSettings()

      logout()

      expect(localStorage.getItem('token')).toBeNull()
      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })
})
