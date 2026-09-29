import UsersIndexView from '@/components/users/UsersIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { MessageEmit } from '@/env'
import type { VueWrapper } from '@vue/test-utils'
import type { UsersResponse } from '@/composables/users/useUsersIndex'
import axios from 'axios'

const { replaceMock, requireLoginMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    requireLoginMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        query: { page: '1' }
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock
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

describe('UsersIndexView', (): void => {
  const mockResponse: UsersResponse = {
    users: [
      { id: 1, name: '佐藤 海翔', department: '品質管理部', admin: false }
    ],
    current_page: 1,
    total_pages: 1
  }

  const mountComponent = () => mount(UsersIndexView, {
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
    describe('成功した場合', (): void => {
      it('ユーザーリストページが表示されること', async (): Promise<void> => {
        requireLoginMock.mockResolvedValueOnce(true)
        vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        // 見出し
        expect(wrapper.find('h3').text()).toBe('ユーザーリスト')

        // ユーザー名
        expect(wrapper.text()).toContain('佐藤 海翔')

        // 部署名
        expect(wrapper.text()).toContain('品質管理部')

        // ページネーション
        expect(wrapper.text()).toContain('前ページ')
        expect(wrapper.text()).toContain('次ページ')
        expect(wrapper.find('a[class="page-link"]').text()).toBe('1')

        // 外部リンク
        const ulElement = wrapper.find('.nav')
        const routerLinks = ulElement.findAllComponents(RouterLinkStub)
        const newLink = routerLinks.find(element => element.props().to === '/users/new')
        const homeLink = routerLinks.find(element => element.props().to === '/home')

        expect(newLink.text()).toBe('ユーザー情報の登録')
        expect(homeLink.text()).toBe('メインメニューへ')
      })
    })

    describe('失敗した場合', (): void => {
      it('404 ページに遷移すること', async (): Promise<void> => {
        requireLoginMock.mockResolvedValueOnce(true)

        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        const emittedMessage = wrapper.emitted<MessageEmit>('message')
        expect(emittedMessage![0][0]).toEqual(
          { type: 'danger', text: 'ユーザーリストの取得に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
