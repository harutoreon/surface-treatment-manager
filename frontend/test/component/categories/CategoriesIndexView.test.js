import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoriesIndexView from '@/components/categories/CategoriesIndexView.vue'

describe('CategoriesIndexView', () => {
  describe('コンポーネントのレンダリング', () => {
    it('「カテゴリーリスト」の見出しが表示されること', () => {
      const wrapper = mount(CategoriesIndexView)

      expect(wrapper.find('h3').text()).toBe('カテゴリーリスト')
    })

    it('「カテゴリー名」と「概要」のラベルが表示されること', () => {
      const wrapper = mount(CategoriesIndexView)
      const links = wrapper.findAll('h6')

      expect(links[0].text()).toBe('カテゴリー名')
      expect(links[1].text()).toBe('概要')
    })

    it('「カテゴリー情報の登録」と「メインメニューへ」のリンクが表示されること', () => {
      const wrapper = mount(CategoriesIndexView)
      const links = wrapper.findAll('routerlink[to="#"]')

      expect(links[5].text()).toBe('カテゴリー情報の登録')
      expect(wrapper.find('routerlink[to="/home"]').text()).toBe('メインメニューへ')
    })
  })
})