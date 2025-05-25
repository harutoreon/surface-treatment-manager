import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import StaticPagesMakerView from '@/components/static_pages/StaticPagesMakerView.vue'

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

describe('StaticPagesMakerView', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(StaticPagesMakerView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    await flushPromises()
  })

  describe('DOMの構造', () => {
    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('h3').exists()).toBe(true)
    })

    it('テキスト入力フィールドが存在すること', () => {
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('検索ボタンが存在すること', () => {
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
      it('/static_pages/maker/search_resultsページが呼び出されること', async () => {
        await wrapper.find('input').setValue('株式会社')
        expect(wrapper.find('input').element.value).toBe('株式会社')

        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(pushMock).toHaveBeenCalledWith({
          name: 'SearchResults',
          params: { searchMethod: 'maker' },
          query: { keyword: '株式会社' }
        })
      })
    })
  })
})
