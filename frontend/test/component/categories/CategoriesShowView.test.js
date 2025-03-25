import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import CategoriesShowView from '@/components/categories/CategoriesShowView.vue'
import axios from 'axios'
import { flushPromises } from '@vue/test-utils'

vi.mock('axios')

vi.mock('vue-router', () => ({
    useRoute: () => ({
      params: { id: '1' }
    }),
}))

describe('CategoriesShowView', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        id: 1,
        item: 'めっき',
        summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      }
    })
  })

  describe('コンポーネントのレンダリング', () => {
    it('カテゴリー情報の見出しが表示されること', () => {
      const wrapper = mount(CategoriesShowView)

      expect(wrapper.find('h3').text()).toBe('カテゴリー情報')
    })

    it('カテゴリー名と概要が表示されること', async () => {
      const wrapper = mount(CategoriesShowView)

      await flushPromises()

      expect(wrapper.findAll('li')[0].findAll('div')[0].text()).toBe('カテゴリー名 :')
      expect(wrapper.findAll('li')[1].findAll('div')[0].text()).toBe('概要 :')
      expect(wrapper.findAll('li')[0].findAll('div')[1].text()).toBe('めっき')
      expect(wrapper.findAll('li')[1].findAll('div')[1].text()).toBe('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')
    })

    it('編集、削除、カテゴリーリストへのリンクが表示されること', () => {
      const wrapper = mount(CategoriesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      expect(wrapper.findAll('a')[0].text()).toBe('カテゴリー情報の編集')
      expect(wrapper.findAll('a')[1].text()).toBe('カテゴリー情報の削除')
      expect(wrapper.findAll('a')[2].text()).toBe('カテゴリーリストへ')
    })

    it('RouterLinkにto属性が定義されていること', async () => {
      const wrapper = mount(CategoriesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      const links = wrapper.findAllComponents({ name: 'RouterLinkStub' })

      expect(links[0].props().to).toBe('/categories/1/edit')
      expect(links[1].props().to).toBe('#')
      expect(links[2].props().to).toBe('/categories')
    })
  })
})
