import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import CommentsShowView from '@/components/comments/CommentsShowView.vue'
import CommentsDestroyView from '@/components/comments/CommentsDestroyView.vue'
import type { VueWrapper } from '@vue/test-utils'
import type { CommentsResponse } from '@/composables/comments/useCommentsShow'

const {
  replaceMock,
  pushMock,
  requireLoginMock,
  useCommentsShowMock,
  fetchCommentDataMock,
  handleDeleteMock,
} = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    pushMock: vi.fn(),
    requireLoginMock: vi.fn(),
    useCommentsShowMock: vi.fn(),
    fetchCommentDataMock: vi.fn(),
    handleDeleteMock: vi.fn(),
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
        push: pushMock
      }
    }
  }
})
vi.mock('@/composables/auth/useAuthGuard', () => {
  return {
    useAuthGuard: () => {
      return {
        requireLogin: requireLoginMock,
      }
    }
  }
})
vi.mock('@/composables/comments/useCommentsShow', () => {
  return {
    useCommentsShow: useCommentsShowMock,
  }
})
vi.mock('@/composables/comments/useCommentsDestroy', () => {
  return {
    useCommentsDestroy: () => {
      return {
        handleDelete: handleDeleteMock,
      }
    }
  }
})

describe('CommentsShowViewDestroy', (): void => {
  const mockResponse: CommentsResponse = {
    comment: {
      id: 1,
      body: '製品に高級感を与える仕上がりで、見た目も美しいです。',
      commenter: '工藤 琴音',
      department: '品質管理部',
      sample_id: 16,
      user_id: 34
    },
    maker_id: 1
  }

  const mountComponent = () => mount(CommentsShowView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.resetAllMocks()
    requireLoginMock.mockResolvedValue(true)
    useCommentsShowMock.mockReturnValue({
      comment: ref(mockResponse.comment),
      sampleId: ref(mockResponse.comment.sample_id),
      makerId: ref(mockResponse.maker_id),
      isAdmin: ref(true),
      fetchCommentData: fetchCommentDataMock,
    })
  })

  describe('レンダリング条件', (): void => {
    it('管理者ユーザーのときは、削除ボタンが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.findComponent(CommentsDestroyView).exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('一般ユーザーのときは、削除ボタンは表示されない', async (): Promise<void> => {
      useCommentsShowMock.mockReturnValue({
        comment: ref(mockResponse),
        sample_id: ref(mockResponse.comment.sample_id),
        makerId: ref(mockResponse.maker_id),
        isAdmin: ref(false),
        fetchCommentData: fetchCommentDataMock,
      })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.findComponent(CommentsDestroyView).exists()).toBe(false)
      expect(wrapper.find('button').exists()).toBe(false)
    })
  })

  describe('子から親への message イベントの中継', (): void => {
    it('マウント直後は message を emit していない', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.emitted('message')).toBeUndefined()
    })

    it('子が message を emit すると、親が同じ payload で再 emit する', async (): Promise<void> => {
      const payload = { type: 'success', text: 'コメント情報を1件削除しました。' }

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      wrapper.findComponent(CommentsDestroyView).vm.$emit('message', payload)

      expect(wrapper.emitted('message')).toEqual([[payload]])
    })
  })

  describe('削除ボタンのクリックイベント', (): void => {
    it('親の画面上で削除ボタンを押すと、handleDelete が 1 回呼ばれる', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('button').trigger('click')

      expect(handleDeleteMock).toHaveBeenCalledTimes(1)
    })
  })
})
