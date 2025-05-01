import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import StaticPagesNameView from '@/components/static_pages/StaticPagesNameView.vue'

describe('StaticPagesNameView', () => {
  describe('DOMの構造', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(StaticPagesNameView)
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
      expect(wrapper.find('a').exists()).toBe(true)
      expect(wrapper.find('a').text()).toBe('メインメニューへ')
      expect(wrapper.find('a').attributes('href')).toBe('/home')
    })
  })
})