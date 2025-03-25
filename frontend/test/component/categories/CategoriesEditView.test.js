import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoriesEditView from '@/components/categories/CategoriesEditView.vue'

let wrapper

beforeEach(() => {
  wrapper = mount(CategoriesEditView)
})

describe('コンポーネントをレンダリングした時に、', () => {
  it('見出し「カテゴリー情報の編集」が表示されること', () => {
    expect(wrapper.find('h3').text()).toBe('カテゴリー情報の編集')
  })

  it('入力フォームが表示されること', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('label[for="category_item"]').text()).toBe('カテゴリー名')
    expect(wrapper.find('label[for="category_summary"]').text()).toBe('概要')
    expect(wrapper.find('input[id="category_item"]').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })
})
