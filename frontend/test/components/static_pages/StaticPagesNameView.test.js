import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import StaticPagesNameView from '@/components/static_pages/StaticPagesNameView.vue'

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

beforeEach(() => {
  pushMock.mockClear()
})

describe('StaticPagesNameView', () => {
  describe('DOMの構造', () => {
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

    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('処理名で検索')
    })
  
    it('テキスト入力が存在すること', () => {
      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.find('input').attributes('placeholder')).toBe('キーワードをここに入力')
    })

    it('ボタンが存在すること', () => {
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('button').text()).toBe('検索')
    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.findComponent({ ref: 'linkHome' }).exists()).toBe(true)
      expect(wrapper.findComponent({ ref: 'linkHome' }).text()).toBe('メインメニューへ')
      expect(wrapper.findComponent({ ref: 'linkHome' }).props().to).toBe('/home')
    })
  })

  describe('API通信', () => {
    describe('有効な検索文字列を入力して送信した場合', () => {
      it('/static_pages/name/search_resultsページに遷移すること', async () => {
        const wrapper = mount(StaticPagesNameView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        await wrapper.find('input').setValue('めっき')
        
        expect(wrapper.find('input').element.value).toBe('めっき')

        await wrapper.find('form').trigger('submit.prevent')
        
        expect(pushMock).toHaveBeenCalledWith({
          name: 'SearchResults',
          params: { searchMethod: 'name' },
          query: { keyword: 'めっき' }
        })
      })
    })
  })
})