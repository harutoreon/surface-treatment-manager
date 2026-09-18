import DepartmentsEditView from '@/components/departments/DepartmentsEditView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { MessageEmit } from '@/env'
import type { Department } from '@/composables/departments/useDepartments'
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

describe('DepartmentsEditView', (): void => {
  const getMockResponse: Department = { id: 1, name: '品質管理部' }

  const mountComponent = () => mount(DepartmentsEditView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期レンダリングに成功した場合', (): void => {
    it('編集フォームが表示されること', async (): Promise<void> => {
      requireLoginMock.mockResolvedValue(true)
      vi.mocked(axios.get).mockResolvedValueOnce({ data: getMockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('部署情報の編集')

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label').text()).toBe('部署名')

      // 入力要素と値
      expect(wrapper.find('#department-name').exists()).toBe(true)
      expect(wrapper.find<HTMLInputElement>('#department-name').element.value).toBe('品質管理部')

      // ボタン要素
      const buttons = wrapper.findAll('button')
      expect(buttons[0].text()).toBe('更新')
      expect(buttons[1].text()).toBe('キャンセル')
    })
  })

  describe('初期レンダリングに失敗した場合', (): void => {
    it('エラーメッセージ付きで NotFound ルートに遷移すること', async (): Promise<void> => {
      requireLoginMock.mockResolvedValue(true)
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

  describe('有効な情報を送信した場合', (): void => {
    it('更新が成功すること', async (): Promise<void> => {
      const patchMockResponse: Department = { id: 1, name: '人事部' }

      requireLoginMock.mockResolvedValue(true)
      vi.mocked(axios.get).mockResolvedValueOnce({ data: getMockResponse })
      vi.mocked(axios.patch).mockResolvedValueOnce({ data: patchMockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('#department-name').setValue('人事部')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage![0][0]).toEqual(
        { type: 'success', text: '部署情報を更新しました。' }
      )
      expect(axios.patch).toHaveBeenCalledWith(
        expect.stringContaining(`/departments/${patchMockResponse.id}`),
        { name: '人事部' }
      )
      expect(pushMock).toHaveBeenCalledWith(`/departments/${patchMockResponse.id}`)
    })
  })

  describe('無効な情報を送信した場合', (): void => {
    it('更新が失敗すること', async (): Promise<void> => {
      requireLoginMock.mockResolvedValue(true)
      vi.mocked(axios.get).mockResolvedValueOnce({ data: getMockResponse })
      vi.mocked(axios.patch).mockRejectedValueOnce({ response: { status: 422 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('#department-name').setValue('')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(vi.mocked(axios.patch)).toHaveBeenCalledWith(
        expect.stringContaining(`/departments/${getMockResponse.id}`),
        expect.objectContaining({ name: '' })
      )
      expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
    })
  })

  describe('キャンセルボタンを押した場合', (): void => {
    it('部署の詳細ページに遷移すること', async (): Promise<void> => {
      requireLoginMock.mockResolvedValue(true)
      vi.mocked(axios.get).mockResolvedValueOnce({ data: getMockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const cancelButton = wrapper.find('.btn-outline-secondary')
      await cancelButton.trigger('click')
      await flushPromises()

      expect(pushMock).toHaveBeenCalledWith(`/departments/${getMockResponse.id}`)
    })
  })
})