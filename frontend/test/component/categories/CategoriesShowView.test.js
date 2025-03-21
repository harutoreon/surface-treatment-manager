import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoriesShowView from '@/components/categories/CategoriesShowView.vue'

describe('CategoriesShowView', () => {
  describe('コンポーネントのレンダリング', () => {
    it('カテゴリー情報の見出しが表示されること', () => {
      const wrapper = mount(CategoriesShowView)

      expect(wrapper.find('h3').text()).toBe('カテゴリー情報')
    })

    it('カテゴリー名と概要が表示されること', () => {
      const wrapper = mount(CategoriesShowView)

      expect(wrapper.findAll('li').at(0).findAll('div').at(0).text()).toBe('カテゴリー名 :')
      expect(wrapper.findAll('li').at(1).findAll('div').at(0).text()).toBe('概要 :')
      expect(wrapper.findAll('li').at(0).findAll('div').at(1).text()).toBe('めっき')
      expect(wrapper.findAll('li').at(1).findAll('div').at(1).text()).toBe('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')
    })

    it('編集、削除、カテゴリーリストへのリンクが表示されること', () => {
      const wrapper = mount(CategoriesShowView)
      
      expect(wrapper.findAll('a').at(0).text()).toBe('編集')
      expect(wrapper.findAll('a').at(1).text()).toBe('削除')
      expect(wrapper.findAll('a').at(2).text()).toBe('カテゴリーリストへ')
    })
  })
})
