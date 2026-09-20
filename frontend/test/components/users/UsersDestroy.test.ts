import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import UsersDestroyView from '@/components/users/UsersDestroyView.vue'

const { handleDeleteMock, useUsersDestroyMock } = vi.hoisted(() => {
  return {
    handleDeleteMock: vi.fn(),
    useUsersDestroyMock: vi.fn(() => {
      return {
        handleDelete: handleDeleteMock
      }
    }),
  }
})

vi.mock('@/composables/users/useUsersDestroy', () => {
  return {
    useUsersDestroy: useUsersDestroyMock,
  }
})

describe('UsersDestroyView', (): void => {
  const mountComponent = () => mount(UsersDestroyView)

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', (): void => {
    it('削除ボタンが表示される', (): void => {
      const wrapper: VueWrapper = mountComponent()
      const button = wrapper.find('button')

      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('ユーザーの削除')
    })

    it('ボタンは type="button" で、危険操作を示すスタイルが付いている', (): void => {
      const wrapper: VueWrapper = mountComponent()
      const button = wrapper.find('button')

      expect(button.attributes('type')).toBe('button')
      expect(button.classes()).toContain('btn-outline-danger')
    })

    it('マウント時点では削除処理は実行されない', (): void => {
      mountComponent()

      expect(handleDeleteMock).not.toHaveBeenCalled()
    })
  })

  describe('composable との連携', (): void => {
    it('useUsersDestroy に emit が渡される', (): void => {
      mountComponent()

      expect(useUsersDestroyMock).toHaveBeenCalledTimes(1)
      expect(useUsersDestroyMock).toHaveBeenCalledWith(expect.any(Function))
    })
  })

  describe('削除ボタンのクリックイベント', (): void => {
    it('クリックすると handleDelete が 1 回呼ばれる',async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()

      await wrapper.find('button').trigger('click')

      expect(handleDeleteMock).toHaveBeenCalledTimes(1)
    })

    it('クリックのたびに handleDelete が呼ばれる', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()

      const button = wrapper.find('button')
      await button.trigger('click')
      await button.trigger('click')

      expect(handleDeleteMock).toHaveBeenCalledTimes(2)
    })
  })
})
