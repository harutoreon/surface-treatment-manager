import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useNavigation } from '@/composables/useNavigation.js'

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

describe('useNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('goHome を実行すると /home へ移動すること', () => {
    const { goHome } = useNavigation()
    goHome()

    expect(pushMock).toHaveBeenCalledWith('/home')
  })
})
