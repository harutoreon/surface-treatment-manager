import { describe, it, expect, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import CategoriesEditView from '@/components/categories/CategoriesEditView.vue'

let wrapper

beforeEach(() => {
  wrapper = mount(CategoriesEditView, {
    global: { stubs: { RouterLink: RouterLinkStub } }
  })
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

  it('外部リンク「カテゴリー情報」と「カテゴリーリストへ」が表示されること', () => {
    expect(wrapper.find('a').text()).toBe('カテゴリー情報へ')
    expect(wrapper.findComponent(RouterLinkStub).text()).toBe('カテゴリーリストへ')
  })

  it('外部リンク「カテゴリーリストへ」のto属性は/categoriesであること', () => {
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe('/categories')
  })
})
