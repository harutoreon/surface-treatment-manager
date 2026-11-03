import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentsDestroyView from '@/components/comments/CommentsDestroyView.vue'
import type { VueWrapper } from '@vue/test-utils'
import type { Props } from '@/components/comments/CommentsDestroyView.vue'

const { handleDeleteMock, useCommentsDestroyMock } = vi.hoisted(() => {
  return {
    handleDeleteMock: vi.fn(),
    useCommentsDestroyMock: vi.fn(() => {
      return {
        handleDelete: handleDeleteMock,
      }
    })
  }
})

vi.mock('@/composables/comments/useCommentsDestroy', () => {
  return {
    useCommentsDestroy: useCommentsDestroyMock,
  }
})

describe('CommentsDestroyView', (): void => {
  const props: Props = {
    makerId: 1,
    sampleId: 1,
    comment: {
      id: 1,
      body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
      commenter: '工藤 琴音',
      department: '品質管理部',
      sample_id: 1,
      user_id: 1
    },
  }

  const mountComponent = () => mount(CommentsDestroyView, {
    props
  })

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', (): void => {
    it('削除ボタンが表示される', (): void => {
      const wrapper: VueWrapper = mountComponent()
      const button = wrapper.find('button')

      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('コメント情報の削除')
    })

    it('マウント時点では削除処理は実行されない', (): void => {
      mountComponent()

      expect(handleDeleteMock).not.toHaveBeenCalled()
    })
  })

  describe('composable との連携', (): void => {
    it('useCommentsDestroy に emit が渡される', (): void => {
      mountComponent()

      expect(useCommentsDestroyMock).toHaveBeenCalledTimes(1)
      expect(useCommentsDestroyMock).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ value: props.makerId }),
        expect.objectContaining({ value: props.sampleId }),
        expect.objectContaining({ value: props.comment }),
      )
    })
  })

  describe('削除ボタンのクリックイベント', (): void => {
    it('クリックすると handleDelete が 1 回呼ばれる', async (): Promise<void> => {
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
