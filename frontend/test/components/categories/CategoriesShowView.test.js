import CategoriesShowView from '@/components/categories/CategoriesShowView.vue'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

const pushMock = vi.fn()
const replaceMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: 1 }
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
        push: pushMock
      }
    }
  }
})

describe('CategoriesShowView', () => {
  let wrapper

  describe('初期レンダリングに成功した場合', () => {
    beforeEach(async () => {
      axios.get.mockResolvedValue({
        data: {
          id: 1,
          item: 'めっき',
          summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
        }
      })

      wrapper = mount(CategoriesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('カテゴリー情報')
    })

    it('カテゴリー情報が表示されること', () => {
      // カテゴリー名
      expect(wrapper.text()).toContain('めっき')

      // 概要
      expect(wrapper.text()).toContain('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')
    })

    it('外部リンクが表示されること', async () => {
      const div = wrapper.find('div[class="d-flex justify-content-evenly"]')
      const routerLinks = div.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/categories/1/edit')
      expect(routerLinks[1].props().to).toBe('/categories')

      // テキスト
      expect(routerLinks[0].text()).toBe('カテゴリー情報の編集')
      expect(routerLinks[1].text()).toBe('カテゴリーリストへ')
    })

    it('リソースの削除リンクが表示されること', () => {
      expect(wrapper.find('p').text()).toBe('カテゴリー情報の削除')
    })
  })

  describe('初期レンダリングに失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      axios.get.mockRejectedValue({
        response: {
          status: 404
        }
      })

      wrapper = mount(CategoriesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: 'カテゴリーの取得に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('カテゴリー情報の削除に成功した場合', () => {
    it('カテゴリーリストページに遷移すること', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      axios.get.mockResolvedValue({
        data: {
          id: 1,
          item: 'めっき',
          summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
        }
      })

      wrapper = mount(CategoriesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      await wrapper.find('p').trigger('click')
      
      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: 'カテゴリーを1件削除しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/categories')
    })
  })

  describe('カテゴリー情報の削除に失敗した場合', () => {
    it('404ページに遷移すること', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      axios.get.mockResolvedValue({
        data: {
          id: 1,
          item: 'めっき',
          summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
        }
      })

      axios.delete.mockRejectedValue({
        response: {
          status: 404
        }
      })

      wrapper = mount(CategoriesShowView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
      
      await flushPromises()
      
      await wrapper.find('p').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'danger', text: '削除処理に失敗しました。' }
      ])
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })
})
