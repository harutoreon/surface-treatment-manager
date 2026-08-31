import StaticPagesNameView from '@/components/static_pages/StaticPagesNameView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import axios from 'axios'

const { pushMock } = vi.hoisted(() => {
  return {
    pushMock: vi.fn()
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

describe('StaticPagesNameView', (): void => {
  const mountComponent = (): VueWrapper => mount(StaticPagesNameView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
    vi.mocked(axios.get).mockResolvedValueOnce({ status: 200 })  // ログインチェック
  })

  describe('初期レンダリングの検証', (): void => {
    it('見出しが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('処理名で検索')
    })
  
    it('検索フォームが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // ラベル要素
      expect(wrapper.find('label').text()).toBe('検索キーワード')

      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // 入力要素
      expect(wrapper.find('#keyword').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('外部リンクが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/home')
      expect(routerLink.text()).toBe('メインメニューへ')
    })
  })

  describe('キーワードを使った検索機能の検証', (): void => {
    describe('有効なキーワドを入力して送信した場合', (): void => {
      it('検索結果ページに遷移すること', async (): Promise<void> => {
        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('#keyword').setValue('めっき')
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(wrapper.find('.alert').exists()).toBe(false)
        expect(pushMock).toHaveBeenCalledWith({
          name: 'SearchResults',
          params: { searchMethod: 'name' },
          query: { keyword: 'めっき' }
        })
      })
    })

    it('未入力でエラー表示後、有効な値で再送信するとエラーが消えて遷移する', async () => {
      const wrapper = mountComponent()
      await flushPromises()

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.find('.alert').exists()).toBe(true)

      await wrapper.find('#keyword').setValue('めっき')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.find('.alert').exists()).toBe(false)
      expect(pushMock).toHaveBeenCalledWith({
        name: 'SearchResults',
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })
    })
  })
})
