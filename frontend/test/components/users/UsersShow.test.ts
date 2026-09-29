import UsersShowView from '@/components/users/UsersShowView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { MessageEmit } from '@/env'
import type { UserResponse } from '@/composables/users/useUsersShow'
import type { Comment } from '@/composables/users/useUserComments'
import axios from 'axios'

const { replaceMock, pushMock, requireLoginMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    pushMock: vi.fn(),
    requireLoginMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1' },
        query:  { page: '1' }
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

describe('UsersShowView', (): void => {
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
    vi.resetAllMocks()
  })

  describe('初期レンダリング', (): void => {
    describe('レンダリングに成功した場合', (): void => {
      it('ユーザー情報ページが表示されること', async (): Promise<void> => {
        requireLoginMock.mockResolvedValueOnce(true)

        vi.mocked(axios.get)
          .mockResolvedValueOnce({ data: mockResponse })
          .mockResolvedValueOnce({ data: mockUserCommentsResponse })

        const wrapper = mountComponent()
        await flushPromises()

        // 見出し
        expect(wrapper.find('h3').text()).toBe('ユーザー情報')

        // ユーザー名
        expect(wrapper.text()).toContain('渡辺 陸斗')

        // 部署名
        expect(wrapper.text()).toContain('開発部')

        // コメント件数
        expect(wrapper.find('#comment-count').text()).toBe('1')

        // 外部リンク
        const routerLinks = wrapper.findAllComponents(RouterLinkStub)
        const editLink = routerLinks.find(
          element => element.props().to === '/users/1/edit')
        const listLink = routerLinks.find(
          element => element.props().to === '/users')

        expect(editLink.text()).toBe('ユーザー情報の編集')
        expect(listLink.text()).toBe('ユーザーリスト')
      })
    })

    describe('fetchUserData() に失敗した場合', (): void => {
      it('エラーメッセージを通知して、404ページに遷移すること', async (): Promise<void> => {
        requireLoginMock.mockResolvedValueOnce(true)

        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

        const wrapper = mountComponent()
        await flushPromises()

        const emittedMessage = wrapper.emitted<MessageEmit>('message')
        expect(emittedMessage).toHaveLength(1)
        expect(emittedMessage?.[0][0]).toEqual(
          { type: 'danger', text: 'ユーザー情報の取得に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })

    describe('fetchUserComments() に失敗した場合', (): void => {
      it('エラーメッセージを通知して、404ページに遷移すること', async (): Promise<void> => {
        requireLoginMock.mockResolvedValueOnce(true)

        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ data: mockResponse })
          .mockRejectedValueOnce({ response: { status: 404 } })

        const wrapper = mountComponent()
        await flushPromises()

        const emittedMessage = wrapper.emitted<MessageEmit>('message')
        expect(emittedMessage).toHaveLength(1)
        expect(emittedMessage?.[0][0]).toEqual(
          { type: 'danger', text: 'コメントリストの取得に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
