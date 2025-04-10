import { describe, it, expect,  vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import CategoriesEditView from '@/components/categories/CategoriesEditView.vue'
import axios from 'axios'

vi.mock('axios')

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1' }
  }),
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('コンポーネントをレンダリングした時に、', () => {
  let wrapper

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        id: 1,
        item: 'めっき',
        summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      }
    })

    wrapper = mount(CategoriesEditView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })
  })
  
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
    const links = wrapper.findAllComponents(RouterLinkStub)

    expect(links[0].text()).toBe('カテゴリー情報へ')
    expect(links[1].text()).toBe('カテゴリーリストへ')
  })

  it('外部リンク「カテゴリーリストへ」のto属性は/categoriesであること', () => {
    const links = wrapper.findAllComponents(RouterLinkStub)

    expect(links[0].props().to).toBe('/categories/1')
    expect(links[1].props().to).toBe('/categories')
  })

  it('「カテゴリー名」と「概要」の値が表示されること', () => {
    expect(wrapper.vm.category.item).toBe('めっき')
    expect(wrapper.vm.category.summary).toBe('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')    
  })
})

describe('フォームの更新ボタンを押した時に、', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(CategoriesEditView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })
  })

  describe('有効なデータを入力していれば', () => {
    it('更新が成功すること', async () => {
      axios.patch.mockResolvedValue({
        data: {
          id: 1,
          item: 'めっき',
          summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
        }
      })
  
      await wrapper.find('form').trigger('submit.prevent')

      expect(axios.patch).toHaveBeenCalled()
    })
  })

  describe('無効なデータを入力していると', () => {
    it('更新が失敗すること', async () => {
      axios.patch.mockRejectedValue(new Error('Invalid credentials'))

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('入力に不備があります。')
    })
  })
})