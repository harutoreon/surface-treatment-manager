import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useUsersDestroy } from '@/composables/users/useUsersDestroy'
import type { MessageEmit } from '@/env'
import axios from 'axios'

const { replaceMock } = vi.hoisted(() => {
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
        replace: replaceMock,
      }
    }
  }
})

describe('useUsersDestroy', (): void => {
  const emitMock: MessageEmit = vi.fn()

  beforeEach((): void => {
    vi.resetAllMocks()
  })

  describe('handleDelete', (): void => {
    beforeEach((): void => {
      vi.stubGlobal('confirm', vi.fn(() => true))
    })

    afterEach((): void => {
      vi.unstubAllGlobals()
    })

    describe('リクエストに成功した場合', (): void => {
      it('ユーザーリストページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.delete).mockResolvedValueOnce({})

        const { handleDelete } = useUsersDestroy(emitMock)
        await handleDelete()

        expect(axios.delete).toHaveBeenCalledWith(
          expect.stringContaining('/users/1')
        )
        expect(emitMock).toHaveBeenCalledWith(
          'message',
          { type: 'success', text: 'ユーザー情報を削除しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith('/users')
      })
    })

    describe('リクエストに失敗した場合', (): void => {
      it('NotFound ルートに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.delete).mockRejectedValueOnce({ response: { status: 404 } })

        const { handleDelete } = useUsersDestroy(emitMock)
        await handleDelete()

        expect(axios.delete).toHaveBeenCalledWith(
          expect.stringContaining('/users/1')
        )
        expect(emitMock).toHaveBeenCalledWith(
          'message',
          { type: 'danger', text: 'ユーザー情報の削除に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
