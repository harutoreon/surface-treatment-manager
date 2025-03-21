import { describe, it, expect, vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
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

      expect(links[0].text()).toBe('カテゴリー情報の登録')
      expect(wrapper.find('routerlink[to="/home"]').text()).toBe('メインメニューへ')
    })
  })

  describe('リンクの動作', () => {
    it('メインメニューのリンクのto属性が/homeであること', async () => {
      const wrapper = mount(CategoriesIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      const links = wrapper.findAllComponents(RouterLinkStub)
      const link = links.find(element => element.text() === 'メインメニューへ')

      expect(link).toBeDefined()
      expect(link.props().to).toBe('/home')
    })
  })
})
