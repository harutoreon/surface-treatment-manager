import { describe, it, expect, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import SearchResultsListView from '@/components/search_results/SearchResultsListView.vue'
// import { RouterLink } from 'vue-router'

describe('SearchResultsListView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SearchResultsListView, {
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
      expect(wrapper.find('h3').text()).toBe('表面処理一覧')
    })

    it('アルバムが存在すること', () => {
      expect(wrapper.find('div[class="album"]').exists()).toBe(true)
    })

    it('カードが存在すること', () => {
      expect(wrapper.find('div[class="card"]').exists()).toBe(true)
      expect(wrapper.find('img').exists()).toBe(true)
      expect(wrapper.find('div[class="card-body"]').exists()).toBe(true)
      expect(wrapper.find('h5').attributes('class')).toContain('card-title')
      expect(wrapper.find('p[class="card-text"]').exists()).toBe(true)
      expect(wrapper.find('a').text()).toBe('詳細へ')
    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.findComponent({ ref: 'linkHome' }).exists()).toBe(true)
      expect(wrapper.findComponent({ ref: 'linkHome' }).text()).toBe('メインメニューへ')
      expect(wrapper.findComponent({ ref: 'linkHome' }).props().to).toBe('/home')
    })
  })
})