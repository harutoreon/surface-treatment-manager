import CategoriesEditView from '@/components/categories/CategoriesEditView.vue'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect,  vi, beforeEach } from 'vitest'
import type { Category } from '@/composables/categories/useCategoriesShow'
import type { VueWrapper } from '@vue/test-utils'
import type { MessageEmit } from '@/env'
import axios from 'axios'

const { replaceMock, pushMock, requireLoginMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    pushMock: vi.fn(),
    requireLoginMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', async () => {
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
        requireLogin: requireLoginMock,
      }
    }
  }
})

describe('CategoriesEditView', (): void => {
  const mountComponent = () => mount(CategoriesEditView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.resetAllMocks()
    requireLoginMock.mockResolvedValue(true)
  })

  describe('初期レンダリングに成功した場合', (): void => {
    it('カテゴリー情報の編集ページが表示されること', async (): Promise<void> => {
      const buildCategory: Category = {
        id: 1,
        item: 'めっき',
        summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      }

      vi.mocked(axios.get).mockResolvedValueOnce({ data: buildCategory })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('カテゴリー情報の編集')

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="category-item"]').text()).toBe('カテゴリー名')
      expect(wrapper.find('label[for="category-summary"]').text()).toBe('概要')

      // 入力要素
      expect(wrapper.find('#category-item').exists()).toBe(true)

      // テキストエリア要素
      expect(wrapper.find('#category-summary').exists()).toBe(true)

      // ボタン要素
      const buttons = wrapper.findAll('button')
      const updateButton = buttons.find(
        button => button.text() === '更新')
      const cancelButton = buttons.find(
        button => button.text() === 'キャンセル')

      expect(updateButton.exists()).toBe(true)
      expect(cancelButton.exists()).toBe(true)
    })
  })

  describe('初期レンダリングに失敗した場合', (): void => {
    it('404ページに遷移すること', async (): Promise<void> => {
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 404 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage[0]?.[0]).toEqual(
        { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
      )
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('有効な情報を送信した場合', (): void => {
    it('更新が成功すること', async (): Promise<void> => {
      const buildCategory: Category = {
        id: 1,
        item: 'めっき',
        summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      }

      vi.mocked(axios.get).mockResolvedValueOnce({ data: buildCategory })
      vi.mocked(axios.patch).mockResolvedValueOnce({
        data: {
          id: 1,
          item: '陽極酸化',
          summary: '人工的にアルミニウム表面に分厚い酸化アルミニウム被膜を作る処理のこと。'
        }
      })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage[0]?.[0]).toEqual(
        { type: 'success', text: 'カテゴリー情報を更新しました。' }
      )
      expect(pushMock).toHaveBeenCalledWith(`/categories/${buildCategory.id}`)
    })
  })

  describe('無効な情報を送信した場合', (): void => {
    it('更新が失敗すること', async (): Promise<void> => {
      const buildCategory: Category = {
        id: 1,
        item: 'めっき',
        summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      }

      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.get).mockResolvedValueOnce({ data: buildCategory })
      vi.mocked(axios.patch).mockRejectedValueOnce({ response: { status: 422 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.find('.alert').text()).toBe('入力に不備があります。')
    })
  })

  describe('キャンセルボタンを押した場合', (): void => {
    it('/categories/1が呼び出されること', async (): Promise<void> => {
      const buildCategory: Category = {
        id: 1,
        item: 'めっき',
        summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      }

      vi.mocked(axios.get).mockResolvedValueOnce({ data: buildCategory })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const buttons = wrapper.findAll('button')
      const cancelButton = buttons.find(
        button => button.text() === 'キャンセル'
      )

      await cancelButton.trigger('click')
      await flushPromises()

      expect(pushMock).toHaveBeenCalledWith(`/categories/${buildCategory.id}`)
    })
  })
})
