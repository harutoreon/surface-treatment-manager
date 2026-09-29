import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { flushPromises, mount, RouterLinkStub, type VueWrapper} from '@vue/test-utils'
import UsersShowView from '@/components/users/UsersShowView.vue'
import UsersDestroyView from '@/components/users/UsersDestroyView.vue'
import type { UserResponse } from '@/composables/users/useUsersShow'
import type { Comment } from '@/composables/users/useUserComments'

const {
  requireLoginMock,
  handleDeleteMock,
  fetchUserDataMock,
  fetchUserCommentsMock,
  useUsersShowMock,
  useUserCommentsMock,
} = vi.hoisted(() => {
  return {
    requireLoginMock: vi.fn(),
    handleDeleteMock: vi.fn(),
    fetchUserDataMock: vi.fn(),
    fetchUserCommentsMock: vi.fn(),
    useUsersShowMock: vi.fn(),
    useUserCommentsMock: vi.fn(),
  }
})

vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1'},
      }
    },
  }
})
vi.mock('@/composables/users/useUsersDestroy', () => {
  return {
    useUsersDestroy: () => {
      return {
        handleDelete: handleDeleteMock
      }
    }
  }
})
vi.mock('@/composables/auth/useAuthGuard', () => {
  return {
    useAuthGuard: () => {
      return {
        requireLogin: requireLoginMock
      }
    }
  }
})
vi.mock('@/composables/users/useUsersShow', () => {
  return {
    useUsersShow: useUsersShowMock,
  }
})
vi.mock('@/composables/users/useUserComments', () => {
  return {
    useUserComments: useUserCommentsMock,
  }
})

describe('UsersShowViewDestroy', (): void => {
  const mockResponse: UserResponse = {
    id: 1,
    name: '渡辺 陸斗',
    department: '開発部',
    admin: false
  }

  const mockUserCommentsResponse: Comment[] = [
    {
      id: 1,
      body: 'sample body',
      commenter: 'sample commenter',
      department: 'sample department',
      sample_id: 1,
      user_id: 1,
    },
  ]

  const mountComponent = () => mount(UsersShowView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
    requireLoginMock.mockResolvedValueOnce(true)
    useUsersShowMock.mockReturnValue({
      user: ref(mockResponse),
      fetchUserData: fetchUserDataMock,
    })
    useUserCommentsMock.mockReturnValue({
      userComments: ref(mockUserCommentsResponse),
      fetchUserComments: fetchUserCommentsMock,
    })
  })

  describe('レンダリング条件', (): void => {
    it('ユーザー情報が取得できていれば、子の削除コンポーネントが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.findComponent(UsersDestroyView).exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('ユーザー情報が null の間は、削除コンポーネントは表示されない', async (): Promise<void> => {
      useUsersShowMock.mockReturnValue({
        user: ref(null),
        fetchUserData: fetchUserDataMock,
      })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.findComponent(UsersDestroyView).exists()).toBe(false)
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
      const payload = { type: 'success', text: 'ユーザー情報を削除しました。' }
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      wrapper.findComponent(UsersDestroyView).vm.$emit('message', payload)

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
