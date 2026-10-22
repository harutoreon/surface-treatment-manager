import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoriesDestroyView from '@/components/categories/CategoriesDestroyView.vue'
import { VueWrapper } from '@vue/test-utils'

const { handleDeleteMock, useCategoriesDestroyMock } = vi.hoisted(() => {
  return {
    handleDeleteMock: vi.fn(),
    useCategoriesDestroyMock: vi.fn(() => {
      return {
        handleDelete: handleDeleteMock,
      }
    }),
  }
})

vi.mock('@/composables/categories/useCategoriesDestroy', () => {
  return {
    useCategoriesDestroy: useCategoriesDestroyMock,
  }
})

describe('CategoriesDestroyView', () => {
  const mountComponent = () => mount(CategoriesDestroyView)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', () => {
    it('削除ボタンが表示される', () => {
      const wrapper: VueWrapper = mountComponent()
      const button = wrapper.find('button')

      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('カテゴリー情報の削除')
    })

    it('マウント時点では削除処理は実行されない', () => {
      mountComponent()

      expect(handleDeleteMock).not.toHaveBeenCalled()
    })
  })

  describe('composable との連携', () => {
    it('useCategoriesDestroy に emit が渡される', () => {
      mountComponent()

      expect(useCategoriesDestroyMock).toHaveBeenCalledTimes(1)

      // any(Function) == useCategoriesDestroy(emit)
      expect(useCategoriesDestroyMock).toHaveBeenCalledWith(expect.any(Function))
    })
  })

  describe('削除ボタンのクリックイベント', () => {
    it('クリックすると handleDelete が 1 回呼ばれる', async () => {
      const wrapper: VueWrapper = mountComponent()

      await wrapper.find('button').trigger('click')

      expect(handleDeleteMock).toHaveBeenCalledTimes(1)
    })

    it('クリックのたびに handleDelete が呼ばれる', async () => {
      const wrapper: VueWrapper = mountComponent()

      const button = wrapper.find('button')
      await button.trigger('click')
      await button.trigger('click')

      expect(handleDeleteMock).toHaveBeenCalledTimes(2)
    })
  })
})
