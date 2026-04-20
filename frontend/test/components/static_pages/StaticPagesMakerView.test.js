import StaticPagesMakerView from '@/components/static_pages/StaticPagesMakerView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const pushMock = vi.fn()

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

describe('StaticPagesMakerView', () => {
  let wrapper

  const mockResponse = [
    { id: 1, name: '東亜電化工業株式会社' },
  ]

  const mountComponent = () =>
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

  describe('ログインチェックに成功した場合', () => {
    it('メーカー名で検索ページに遷移すること', async () => {
      vi.mocked(axios).get
        .mockResolvedValueOnce({ status: 200 })         // ログインチェック
        .mockResolvedValueOnce({ data: mockResponse })  // メーカー一覧の取得

      wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('メーカー名で検索')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('message イベントが発火し、ログインページに遷移すること', async () => {
      vi.mocked(axios).get.mockRejectedValue({ response: { status: 401 } })  // ログインチェック

      wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.emitted('message')).toEqual(
        [
          [
            {
              'text': 'ログインが必要です。',
              'type': 'danger'
            }
          ]
        ]
      )
      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('初期レンダリング', () => {
    beforeEach(async () => {
      vi.mocked(axios).get
        .mockResolvedValueOnce({ status: 200 })         // ログインチェック
        .mockResolvedValueOnce({ data: mockResponse })  // メーカーリストの取得

      wrapper = mountComponent()
      await flushPromises()
    })

    it('見出し表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('メーカー名で検索')
    })

    it('検索フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // 入力要素
      expect(wrapper.find('input').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('検索')
    })

    it('外部リンクが表示されること', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/home')
      expect(routerLink.text()).toBe('メインメニューへ')
    })
  })

  describe('キーワードを入力して送信した場合', () => {
    it('検索結果のページに遷移されること', async () => {
      vi.mocked(axios).get
        .mockResolvedValueOnce({ status: 200 })         // ログインチェック
        .mockResolvedValueOnce({ data: mockResponse })  // メーカーリストの取得

      wrapper = mountComponent()
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

  describe('キーワードを未入力で送信した場合', () => {
    it('エラーメッセージが表示されること', async () => {
      vi.mocked(axios).get
        .mockResolvedValueOnce({ status: 200 })         // ログインチェック
        .mockResolvedValueOnce({ data: mockResponse })  // メーカーリストの取得

      wrapper = mountComponent()
      await flushPromises()

      await wrapper.find('form').trigger('submit')
      expect(wrapper.find('.alert').text()).toBe('キーワードが未入力です')
    })
  })
})
