import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import CategoriesNewView from '@/components/categories/CategoriesNewView.vue'
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
    expect(wrapper.find('label[for="category-item"]').text()).toBe('カテゴリー名')
    expect(wrapper.find('label[for="category-summary"]').text()).toBe('概要')
    expect(wrapper.find('input[id="category-item"]').exists()).toBe(true)
    expect(wrapper.find('textarea[id="category-summary"]').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('外部リンクが表示されること', () => {
    expect(wrapper.findComponent({ ref: 'linkCategories' }).props().to).toBe('/categories')
    expect(wrapper.findComponent({ ref: 'linkCategories' }).text()).toBe('カテゴリーリストへ')
  })
})

describe('カテゴリー登録で', () => {
  describe('有効な情報を入力した場合、', () => {
    it('登録が成功すること', async () => {
      const mockCategory = {
        data: {
          id: 1,
          item: 'test item',
          summary: 'test summary'
        }
      }

      axios.post.mockResolvedValue({ data: { category: mockCategory} })

      const itemInput = wrapper.find('input[id="category-item"]')
      const summaryTextArea = wrapper.find('textarea[id="category-summary"]')

      await itemInput.setValue('test item')
      await summaryTextArea.setValue('test summary')
      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.emitted()).toHaveProperty('message')
      expect(wrapper.emitted().message[0]).toEqual([
        { type: 'success', text: 'カテゴリーを1件登録しました。' }
      ])
      expect(pushMock).toHaveBeenCalledWith(`/categories/${mockCategory.id}`)
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
