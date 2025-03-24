import { describe, it, expect, vi, beforeEach } from 'vitest'
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

let wrapper

beforeEach(() => {
  wrapper = mount(CategoriesNewView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })
})

describe('コンポーネントをレンダリングした時に、', () => {  
  it('見出し「カテゴリー情報の登録」が表示されること。', () => {
    expect(wrapper.find('h3').text()).toBe('カテゴリー情報の登録')
  })

  it('入力フォームが表示されること。', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('label[for="category_item"]').text()).toBe('カテゴリー名')
    expect(wrapper.find('label[for="category_summary"]').text()).toBe('概要')
    expect(wrapper.find('input[id="category_item"]').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('外部リンク「カテゴリーリストへ」が表示されること', () => {
    expect(wrapper.findComponent(RouterLinkStub).text()).toBe('カテゴリーリストへ')
  })

  it('外部リンク「カテゴリーリストへ」のto属性は/categoriesであること', () => {
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe('/categories')
  })
})

describe('カテゴリー登録で', () => {
  describe('有効な情報を入力した場合、', () => {
    it('登録が成功すること', async () => {
      const mockCategory = {
        data: {
          item: 'test item',
          summary: 'test summary'
        }
      }

      axios.post.mockResolvedValue({ data: { category: mockCategory} })

      const itemInput = wrapper.find('input[id="category_item"]')
      const summaryTextArea = wrapper.find('textarea')

      await itemInput.setValue('test item')
      await summaryTextArea.setValue('test summary')
      await wrapper.find('form').trigger('submit.prevent')

      expect(router.push).toHaveBeenCalledWith(`/categories/${mockCategory.id}`)
    })
  })

  describe('無効な情報を入力した場合、', () => {
    it('登録が失敗すること', async () => {
      axios.post.mockRejectedValue(new Error('Invalid credentials'))

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('入力に不備があります。')
    })
  })
})
