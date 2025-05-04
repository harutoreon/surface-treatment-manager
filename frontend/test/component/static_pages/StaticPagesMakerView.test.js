import { describe, it, expect, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import StaticPagesMakerView from '@/components/static_pages/StaticPagesMakerView.vue'

describe('StaticPagesMakerView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(StaticPagesMakerView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })
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
})