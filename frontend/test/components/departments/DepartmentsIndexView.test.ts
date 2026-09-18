import DepartmentsIndexView from '@/components/departments/DepartmentsIndexView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import type { MessageEmit } from '@/env'
import type { VueWrapper } from '@vue/test-utils'
import type { Department } from '@/composables/departments/useDepartments'
import axios from 'axios'

const { requireLoginMock, replaceMock } = vi.hoisted(() => {
  return {
    requireLoginMock: vi.fn(),
    replaceMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
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

describe('DepartmentsIndexView', (): void => {
  const mockResponse: Department[] = [
    { id: 1, name: '品質管理部' }
  ]

  const mountComponent = () => mount(DepartmentsIndexView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
    vi.mocked(requireLoginMock).mockResolvedValue(true)
  })

  describe('初期レンダリングに成功した場合', (): void => {
    beforeEach((): void => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })
    })

    it('見出しが表示されること', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('部署リスト')      
    })

    it('部署名の一覧が表示されること', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const routerLink = wrapper.findComponent(RouterLinkStub)

      // to属性
      expect(routerLink.props().to).toBe('/departments/1')

      // テキスト
      expect(routerLink.text()).toBe('品質管理部')
    })

    it('外部リンクが表示されること', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const ul = wrapper.find('.nav')
      const routerLinks = ul.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/departments/new')
      expect(routerLinks[1].props().to).toBe('/home')

      // テキスト
      expect(routerLinks[0].text()).toBe('部署情報の登録へ')
      expect(routerLinks[1].text()).toBe('メインメニューへ')
    })
  })

  describe('初期レンダリングに失敗した場合', (): void => {
    it('404ページに遷移すること', async (): Promise<void> => {
      vi.mocked(axios.isAxiosError).mockResolvedValue(true)
      vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage![0][0]).toEqual(
        { type: 'danger', text: '部署リストの取得に失敗しました。' }
      )
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})