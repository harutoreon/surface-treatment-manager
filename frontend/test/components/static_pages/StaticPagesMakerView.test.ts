import StaticPagesMakerView from '@/components/static_pages/StaticPagesMakerView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { MakerResponse } from '@/composables/static_pages/useStaticPagesMaker'
import axios from 'axios'

const { pushMock } = vi.hoisted(() => {
  return {
    pushMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('StaticPagesMakerView', (): void => {
  const mockResponse: MakerResponse[] = [
    { id: 1, name: '東亜電化工業株式会社' },
  ]

  const mountComponent = (): VueWrapper =>
    mount(StaticPagesMakerView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', (): void => {
    beforeEach(async (): Promise<void> => {
      vi.mocked(axios).get
        .mockResolvedValueOnce({ status: 200 })         // ログインチェック
        .mockResolvedValueOnce({ data: mockResponse })  // メーカーリストの取得
    })

    it('見出し表示されること', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('メーカー名で検索')
    })

    it('検索フォームが表示されること', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // 入力要素
      expect(wrapper.find('input').exists()).toBe(true)

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

  describe('キーワードを入力して送信した場合', (): void => {
    it('検索結果のページに遷移されること', async (): Promise<void> => {
      vi.mocked(axios).get
        .mockResolvedValueOnce({ status: 200 })         // ログインチェック
        .mockResolvedValueOnce({ data: mockResponse })  // メーカーリストの取得

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('input').setValue('株式会社')
      await wrapper.find('form').trigger('submit')

      expect(pushMock).toHaveBeenCalledWith({
        name: 'SearchResults',
        params: { searchMethod: 'maker' },
        query: { keyword: '株式会社' }
      })
    })
  })

  describe('キーワードを未入力で送信した場合', (): void => {
    it('エラーメッセージが表示されること', async (): Promise<void> => {
      vi.mocked(axios).get
        .mockResolvedValueOnce({ status: 200 })         // ログインチェック
        .mockResolvedValueOnce({ data: mockResponse })  // メーカーリストの取得

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('form').trigger('submit')
      expect(wrapper.find('.alert').text()).toBe('キーワードが未入力です')
    })
  })
})
