import StaticPagesNameView from '@/components/static_pages/StaticPagesNameView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

const pushMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('StaticPagesNameView', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(StaticPagesNameView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    await flushPromises()
  })

  describe('初期レンダリング', () => {
    it('見出しが表示されること', () => {
      expect(wrapper.find('p.fs-3').text()).toBe('処理名で検索')
    })
  
    it('検索フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // 入力要素
      expect(wrapper.find('input').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('外部リンクが表示されること', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/home')
      expect(routerLink.text()).toBe('メインメニューへ')
    })
  })

  describe('キーワードを入力して送信した場合', () => {
    it('検索結果ページに遷移すること', async () => {
      await wrapper.find('input').setValue('めっき')
      await wrapper.find('form').trigger('submit.prevent')
      
      expect(pushMock).toHaveBeenCalledWith({
        name: 'SearchResults',
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })
    })
  })
})