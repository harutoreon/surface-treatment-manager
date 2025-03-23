import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoriesNewView from '@/components/categories/CategoriesNewView.vue'

describe('CategoriesNewView コンポーネントをレンダリングした時に、', () => {
  it('見出し「カテゴリー情報の登録」が表示されること。', () => {
    const wrapper = mount(CategoriesNewView)

    expect(wrapper.find('h3').text()).toBe('カテゴリー情報の登録')
  })

  it('入力フォームが表示されること。', () => {
    const wrapper = mount(CategoriesNewView)

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAll('label')[0].text()).toBe('カテゴリー名')
    expect(wrapper.findAll('label')[1].text()).toBe('概要')
    expect(wrapper.findAll('input[type="text"]').length).toBe(2)
    expect(wrapper.find('input[type="submit"][value="登録"]').exists()).toBe(true)
  })

  it('外部リンク「カテゴリーリストへ」が表示されること', () => {
    const wrapper = mount(CategoriesNewView)

    expect(wrapper.find('a').text()).toBe('カテゴリーリストへ')
  })
})
