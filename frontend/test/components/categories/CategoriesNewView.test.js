import CategoriesNewView from '@/components/categories/CategoriesNewView.vue'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

const pushMock = vi.fn()

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('CategoriesNewView', () => {
  let wrapper

  describe('初期レンダリング', () => {  
    beforeEach(() => {
      wrapper = mount(CategoriesNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('h3').text()).toBe('カテゴリー情報の登録')
    })

    it('入力フォームが表示されること', () => {
      // フォーム要素
      expect(wrapper.find('form').exists()).toBe(true)

      // ラベル要素
      expect(wrapper.find('label[for="category-item"]').text()).toBe('カテゴリー名')
      expect(wrapper.find('label[for="category-summary"]').text()).toBe('概要')

      // 入力要素・テキストエリア要素
      expect(wrapper.find('#category-item').exists()).toBe(true)
      expect(wrapper.find('#category-summary').exists()).toBe(true)

      // ボタン要素
      expect(wrapper.find('button').text()).toBe('登録')
    })

    it('外部リンクが表示されること', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)

      expect(routerLink.props().to).toBe('/categories')
      expect(routerLink.text()).toBe('カテゴリーリストへ')
    })
  })

  describe('有効な情報を送信した場合', () => {
    it('登録に成功すること', async () => {
      axios.post.mockResolvedValue({
        data: {
          id: 1,
          item: 'めっき',
          summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
        }
      })

      wrapper = mount(CategoriesNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      const itemInput = wrapper.find('#category-item')
      const summaryTextArea = wrapper.find('#category-summary')

      await itemInput.setValue('めっき')
      await summaryTextArea.setValue('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')
      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: 'カテゴリーを1件登録しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith('/categories/1')
    })
  })

  describe('無効な情報を送信した場合', () => {
    it('登録に失敗すること', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 422
        }
      })

      wrapper = mount(CategoriesNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()
      
      const itemInput = wrapper.find('#category-item')
      const summaryTextArea = wrapper.find('#category-summary')

      await itemInput.setValue('')
      await summaryTextArea.setValue('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')
      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('入力に不備があります。')
    })
  })
})
