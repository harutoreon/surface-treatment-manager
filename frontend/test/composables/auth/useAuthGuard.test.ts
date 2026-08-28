import { useAuthGuard } from '@/composables/auth/useAuthGuard.ts'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import type { Emit } from '@/composables/auth/useAuthGuard'

const { pushMock } = vi.hoisted(() => {
  return {
    pushMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock,
      }
    }
  }
})

describe('useAuthGuard', (): void => {
  const emitMock = vi.fn<Emit>()

  beforeEach((): void => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'dummy-token')
  })

  it('戻り値が false の場合は、エラーメッセージ付きでログインルートに遷移すること', async (): Promise<void> => {
    vi.mocked(axios.get).mockRejectedValue( { response: { status: 401 } } )
    vi.mocked(axios.isAxiosError).mockReturnValue(true)

    const { requireLogin } = useAuthGuard(emitMock)
    const loggedIn = await requireLogin()

    expect(loggedIn).toBe(false)
    expect(pushMock).toHaveBeenCalledWith('/')
    expect(emitMock).toHaveBeenCalledWith(
      'message',
      { type: 'danger', text: 'ログインが必要です。' }
    )
  })

  it('戻り値が true の場合は、ログインに成功する', async (): Promise<void> => {
    vi.mocked(axios.get).mockResolvedValue({ status: 200 })

    const { requireLogin } = useAuthGuard(emitMock)
    const loggedIn = await requireLogin()

    expect(loggedIn).toBe(true)
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/logged_in'),
      expect.objectContaining(
        { 'headers': { 'Authorization': 'Bearer dummy-token' } }
      )
    )
    expect(emitMock).not.toHaveBeenCalled()
  })
})
