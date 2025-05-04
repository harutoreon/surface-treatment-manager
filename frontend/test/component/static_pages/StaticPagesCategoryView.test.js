import { describe, it, expect, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import StaticPagesCategoryView from '@/components/static_pages/StaticPagesCategoryView.vue'
// import { RouterLink } from 'vue-router'

describe('StaticPagesCategory', () => {
  describe('DOMの構造', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(StaticPagesCategoryView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
    })

    it('見出しが存在すること', () => {
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('カテゴリーで検索')
    })

    it('ドロップダウンリストが存在すること', () => {
      expect(wrapper.find('select').exists()).toBe(true)

      expect(wrapper.find('option[value="めっき"]').exists()).toBe(true)
      expect(wrapper.find('option[value="めっき"]').text()).toBe('めっき')
      
      expect(wrapper.find('option[value="陽極酸化"]').exists()).toBe(true)
      expect(wrapper.find('option[value="陽極酸化"]').text()).toBe('陽極酸化')
      
      expect(wrapper.find('option[value="化成"]').exists()).toBe(true)
      expect(wrapper.find('option[value="化成"]').text()).toBe('化成')
      
      expect(wrapper.find('option[value="コーティング"]').exists()).toBe(true)
      expect(wrapper.find('option[value="コーティング"]').text()).toBe('コーティング')
      
      expect(wrapper.find('option[value="表面硬化"]').exists()).toBe(true)
      expect(wrapper.find('option[value="表面硬化"]').text()).toBe('表面硬化')
    })

    it('ボタンが存在すること', () => {
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('button').text()).toBe('検索')
    })

    it('外部リンクが存在すること', () => {
      expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(true)
      expect(wrapper.findComponent(RouterLinkStub).text()).toBe('メインメニューへ')
      expect(wrapper.findComponent(RouterLinkStub).props().to).toBe('/home')
    })
  })
})
