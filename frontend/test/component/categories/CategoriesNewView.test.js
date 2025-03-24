import { describe, it, expect, vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import CategoriesNewView from '@/components/categories/CategoriesNewView.vue'
import axios from 'axios'
import router from '@/router'

vi.mock('axios')

vi.mock('@/router', () => {
  return {
    default: {
      push: vi.fn()
    }
  }
})

describe('CategoriesNewView コンポーネントをレンダリングした時に、', () => {
  it('見出し「カテゴリー情報の登録」が表示されること。', () => {
    const wrapper = mount(CategoriesNewView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect(wrapper.find('h3').text()).toBe('カテゴリー情報の登録')
  })

  it('入力フォームが表示されること。', () => {
    const wrapper = mount(CategoriesNewView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAll('label')[0].text()).toBe('カテゴリー名')
    expect(wrapper.findAll('label')[1].text()).toBe('概要')
    expect(wrapper.findAll('input[type="text"]').length).toBe(2)
    expect(wrapper.find('input[type="submit"][value="登録"]').exists()).toBe(true)
  })

  it('外部リンク「カテゴリーリストへ」が表示されること', () => {
    const wrapper = mount(CategoriesNewView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect(wrapper.find('a').text()).toBe('カテゴリーリストへ')
  })
})

describe('カテゴリー登録で', () => {
  describe('有効な情報を入力した場合、', () => {
    it('登録が成功すること', async () => {
      const wrapper = mount(CategoriesNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      const mockCategory = {
        data: {
          item: 'test item',
          summary: 'test summary'
        }
      }

      axios.post.mockResolvedValue({ data: { category: mockCategory} })

      const itemInput = wrapper.find('input[id="category_item"]')
      const summaryInput = wrapper.find('input[id="category_summary"]')

      await itemInput.setValue('test item')
      await summaryInput.setValue('test summary')
      await wrapper.find('form').trigger('submit.prevent')

      expect(router.push).toHaveBeenCalledWith(`/categories/${mockCategory.id}`)
    })
  })

  describe('無効な情報を入力した場合、', () => {
    it('登録が失敗すること', async () => {
      const wrapper = mount(CategoriesNewView, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      axios.post.mockRejectedValue(new Error('Invalid credentials'))

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('入力に不備があります。')
    })
  })
})
