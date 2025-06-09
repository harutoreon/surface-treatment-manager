import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import CategoriesIndexView from '@/components/categories/CategoriesIndexView.vue'
import axios from 'axios'

const replaceMock = vi.fn()

vi.mock('axios')

vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        replace: replaceMock
      }
    }
  }
})

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
      const wrapper = mount(CategoriesIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
      const links = wrapper.findAll('a')

      expect(links[0].text()).toBe('カテゴリー情報の登録')
      expect(links[1].text()).toBe('メインメニューへ')
    })
  })

  describe('リンクの動作', () => {
    it('外部リンクが表示されること', async () => {
      axios.get.mockResolvedValue({
        data: [
          { 'id': 1, 'item': 'めっき' },
          { 'id': 2, 'item': '陽極酸化' },
          { 'id': 3, 'item': '化成' },
          { 'id': 4, 'item': 'コーティング' },
          { 'id': 5, 'item': '表面硬化' }
        ]
      })

      const wrapper = mount(CategoriesIndexView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(wrapper.findComponent({ ref: 'linkCategoriesNew' }).props().to).toBe('/categories/new')
      expect(wrapper.findComponent({ ref: 'linkCategoriesNew' }).text()).toBe('カテゴリー情報の登録')
      expect(wrapper.findComponent({ ref: 'linkHome' }).props().to).toBe('/home')
      expect(wrapper.findComponent({ ref: 'linkHome' }).text()).toBe('メインメニューへ')
    })
  })

  describe('API通信', () => {
    describe('カテゴリーリストの取得に成功した場合', () => {
      it('カテゴリーの一覧が表示されること', async () => {
        axios.get.mockResolvedValue({
          data: [
            { 'id': 1, 'item': 'めっき' },
            { 'id': 2, 'item': '陽極酸化' },
            { 'id': 3, 'item': '化成' },
            { 'id': 4, 'item': 'コーティング' },
            { 'id': 5, 'item': '表面硬化' }
          ]
        })

        const wrapper = mount(CategoriesIndexView, {
          global: {
            stubs: {
              RouterLink: RouterLinkStub
            }
          }
        })

        await flushPromises()

        expect(wrapper.text()).toContain('めっき')
        expect(wrapper.text()).toContain('陽極酸化')
        expect(wrapper.text()).toContain('化成')
        expect(wrapper.text()).toContain('コーティング')
        expect(wrapper.text()).toContain('表面硬化')
      })
    })

    describe('カテゴリーリストの取得に失敗した場合', () => {
      it('404ページに遷移すること', async () => {
        axios.get.mockRejectedValue({
          response: {
            status: 404
          }
        })

        const wrapper = mount(CategoriesIndexView, {
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
  })
})
