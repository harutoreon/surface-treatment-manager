import DepartmentsNewView from '@/components/departments/DepartmentsNewView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { Department } from '@/composables/departments/useDepartments'
import type { MessageEmit } from '@/env'
import axios from 'axios'

const { requireLoginMock, pushMock } = vi.hoisted(() => {
  return {
    requireLoginMock: vi.fn(),
    pushMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: vi.fn(),
    useRouter: () => {
      return {
        push: pushMock
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

describe('DepartmentsNewView', (): void => {
  const mountComponent = () => mount(DepartmentsNewView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', (): void => {
    beforeEach((): void => {
      requireLoginMock.mockResolvedValueOnce(true)
    })

    it('見出しが表示されること', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('部署情報の登録')
    })

    it('入力フォームが表示されること', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label').text()).toBe('部署名')

      // 入力要素
      expect(wrapper.find('#department-name').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('登録')
    })

    it('外部リンクが表示されること', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const routerlink = wrapper.findComponent(RouterLinkStub)

      expect(routerlink.props().to).toBe('/departments')
      expect(routerlink.text()).toBe('部署リストへ')
    })
  })

  describe('新規登録処理', (): void => {
    beforeEach((): void => {
      requireLoginMock.mockResolvedValueOnce(true)
    })

    describe('入力フォームから有効な情報を送信した場合', (): void => {
      it('登録に成功すること', async (): Promise<void> => {
        const postMockResponse: Department = { id: 1, name: '品質管理部' }

        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.post).mockResolvedValueOnce({ data: postMockResponse })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('#department-name').setValue('品質管理部')
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const emittedMessage = wrapper.emitted<MessageEmit>('message')
        expect(emittedMessage![0][0]).toEqual(
          { type: 'success', text: '部署を1件登録しました。' }
        )
        expect(pushMock).toHaveBeenCalledWith('/departments/1')
      })
    })

    describe('入力フォームから無効な情報を送信した場合', (): void => {
      it('登録に失敗すること', async (): Promise<void> => {
        vi.mocked(axios.post).mockRejectedValueOnce({ response: { status: 422 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('#department-name').setValue('')
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
      })
    })
  })
})
