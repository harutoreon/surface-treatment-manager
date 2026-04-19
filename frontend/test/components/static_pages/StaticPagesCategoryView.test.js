import StaticPagesCategoryView from '@/components/static_pages/StaticPagesCategoryView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import axios from 'axios'

const replaceMock = vi.fn()
const pushMock = vi.fn()

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

describe('StaticPagesCategory', () => {
  let wrapper

  const mountComponent = () =>
    mount(StaticPagesCategoryView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

  const mockResponse = [
    { id: 1, item: 'めっき' },
    { id: 2, item: '陽極酸化' },
    { id: 3, item: '化成' },
    { id: 4, item: 'コーティング' },
    { id: 5, item: '表面硬化' },
  ]

  beforeEach (() => {
    vi.clearAllMocks()
  })

  describe('ログインチェックに成功した場合', () => {
    it('カテゴリーで検索ページに移動すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          status: 200
        })

      wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('カテゴリーで検索')
    })
  })

  describe('ログインチェックに失敗した場合', () => {
    it('ログインページに移動すること', async () => {
      axios.get.mockRejectedValueOnce({
        response: {
          status: 401
        }
      })

      wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'ログインが必要です。' }
      ])
      expect(pushMock).toHaveBeenCalledTimes(1)
      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: mockResponse
        })

      wrapper = mountComponent()
      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('カテゴリーで検索')
    })

    it('検索フォームが表示されること', () => {
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

    it('外部リンクが表示されること', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/home')
      expect(routerLink.text()).toBe('メインメニューへ')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockRejectedValueOnce({
          response: {
            status: 404
          }
        })

      wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('カテゴリーを選択して送信した場合', () => {
    it('/static_pages/categoryのパスが呼び出されること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: mockResponse
        })

      wrapper = mountComponent()
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

  describe('カテゴリーを未選択で送信した場合', () => {
    it('エラーメッセージが表示されること', async () => {
      axios.get
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: mockResponse
        })

      wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('select').element.value).toBe('')

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.find('.alert-danger').text()).toBe('リスト内の項目を選択して下さい')
    })
  })
})
