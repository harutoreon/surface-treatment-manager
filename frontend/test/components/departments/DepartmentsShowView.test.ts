import DepartmentsShowView from '@/components/departments/DepartmentsShowView.vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { Department } from '@/composables/departments/useDepartments'
import type { MessageEmit } from '@/env'
import axios from 'axios'

const { requireLoginMock, replaceMock, pushMock } = vi.hoisted(() => {
  return {
    requireLoginMock: vi.fn(),
    replaceMock: vi.fn(),
    pushMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1' },
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock,
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

describe('DepartmentsShowView', (): void => {
  const mockResponse: Department = {
    id: 1,
    name: '品質管理部'
  }

  const mountComponent = () => mount(DepartmentsShowView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
    requireLoginMock.mockResolvedValue(true)
  })

  describe('初期レンダリングに成功した場合', (): void => {
    it('部署情報ページが表示される', async (): Promise<void> => {
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('部署情報')

      // 部署名
      const departmentInfoItem = wrapper.find('.list-group-item')
      expect(departmentInfoItem.text()).toContain('部署名 :')
      expect(departmentInfoItem.text()).toContain('品質管理部')

      // ナビゲーションリンク
      const routerLinks = wrapper.findAllComponents(RouterLinkStub)
      expect(routerLinks[0].props().to).toBe('/departments/1/edit')
      expect(routerLinks[1].props().to).toBe('/departments')
      expect(routerLinks[0].text()).toBe('部署情報の編集へ')
      expect(routerLinks[1].text()).toBe('部署リストへ')
    })
  })

  describe('初期レンダリングに失敗した場合', (): void => {
    it('404ページに遷移すること', async (): Promise<void> => {
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage![0][0]).toEqual(
        { type: 'danger', text: '部署情報の取得に失敗しました。' }
      )
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('削除処理', (): void => {
    beforeEach((): void => {
      vi.stubGlobal('confirm', vi.fn((): boolean => true))
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse })
    })

    afterEach((): void => {
      vi.unstubAllGlobals()
    })

    describe('処理に成功した場合', (): void => {
      it('部署リストページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.delete).mockResolvedValueOnce({ status: 204 })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('button').trigger('click')
        await flushPromises()

        const emittedMessage = wrapper.emitted<MessageEmit>('message')
        expect(emittedMessage![0][0]).toEqual(
          { type: 'success', text: '部署情報を1件削除しました。' }
        )
        expect(pushMock).toHaveBeenCalledWith('/departments')
      })
    })

    describe('処理に失敗した場合', (): void => {
      it('404ページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.delete).mockRejectedValueOnce({ response: { status: 404 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('button').trigger('click')
        await flushPromises()

        const emittedMessage = wrapper.emitted<MessageEmit>('message')
        expect(emittedMessage![0][0]).toEqual(
          { type: 'danger', text: '削除処理に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})