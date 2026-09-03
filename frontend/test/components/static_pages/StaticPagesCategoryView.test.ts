import StaticPagesCategoryView from '@/components/static_pages/StaticPagesCategoryView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'
import type { VueWrapper } from '@vue/test-utils'
import type { Option } from '@/composables/static_pages/useStaticPagesCategory'
import type { MessageEmit } from '@/env'

const { replaceMock, pushMock } = vi.hoisted(() => {
  return {
    replaceMock: vi.fn(),
    pushMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock,
      }
    },
  }
})

describe('StaticPagesCategory', (): void => {
  const mountComponent = (): VueWrapper =>
    mount(StaticPagesCategoryView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

  const mockResponse: Option[] = [
    { id: 1, item: 'めっき' },
    { id: 2, item: '陽極酸化' },
    { id: 3, item: '化成' },
    { id: 4, item: 'コーティング' },
    { id: 5, item: '表面硬化' },
  ]

  beforeEach ((): void => {
    vi.clearAllMocks()
  })

  describe('ログインチェックに成功した場合', (): void => {
    it('カテゴリーで検索ページに移動すること', async (): Promise<void> => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ status: 200 })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('カテゴリーで検索')
    })
  })

  describe('ログインチェックに失敗した場合', (): void => {
    it('ログインページに移動すること', async (): Promise<void> => {
      vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 401 } })
      vi.mocked(axios.isAxiosError).mockReturnValue(true)

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage).toBeTruthy()
      expect(emittedMessage![0]).toEqual([
        { type: 'danger', text: 'ログインが必要です。' }
      ])
      expect(pushMock).toHaveBeenCalledTimes(1)
      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('初期レンダリングに成功した場合', (): void => {
    beforeEach(async (): Promise<void> => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })
    })

    it('見出しが表示されること', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('カテゴリーで検索')
    })

    it('検索フォームが表示されること', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // 選択要素
      expect(wrapper.find('select').exists()).toBe(true)
      expect(wrapper.find('option[value="めっき"]').text()).toBe('めっき')
      expect(wrapper.find('option[value="陽極酸化"]').text()).toBe('陽極酸化')
      expect(wrapper.find('option[value="化成"]').text()).toBe('化成')
      expect(wrapper.find('option[value="コーティング"]').text()).toBe('コーティング')
      expect(wrapper.find('option[value="表面硬化"]').text()).toBe('表面硬化')

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('検索')
    })

    it('外部リンクが表示されること', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/home')
      expect(routerLink.text()).toBe('メインメニューへ')
    })
  })

  describe('初期レンダリングに失敗した場合', (): void => {
    it('404ページに遷移すること', async (): Promise<void> => {
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockRejectedValueOnce({ response: { status: 404 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEmit>('message')
      expect(emittedMessage).toBeTruthy()
      expect(emittedMessage![0]).toEqual([
        { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('カテゴリーを選択して送信した場合', (): void => {
    it('/static_pages/categoryのパスが呼び出されること', async (): Promise<void> => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('select').setValue('めっき')
      await wrapper.find('form').trigger('submit.prevent')

      expect(pushMock).toHaveBeenCalledWith({
        name: 'SearchResults',
        params: { searchMethod: 'category' },
        query: { keyword: 'めっき' }
      })
    })
  })

  describe('カテゴリーを未選択で送信した場合', (): void => {
    it('エラーメッセージが表示されること', async (): Promise<void> => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('select').element.value).toBe('')

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.find('.alert-danger').text()).toBe('リスト内の項目を選択して下さい')
    })
  })
})
