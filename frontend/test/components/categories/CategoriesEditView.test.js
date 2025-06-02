import { describe, it, expect,  vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import CategoriesEditView from '@/components/categories/CategoriesEditView.vue'
import axios from 'axios'

vi.mock('axios')

const replaceMock = vi.fn()
const pushMock = vi.fn()

vi.mock('vue-router', async () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1' }
      }
    },
    useRouter: () => {
      return {
        push: pushMock,
        replace: replaceMock
      }
    }
  }
})

describe('コンポーネントをレンダリングした時に、', () => {
  let wrapper

  beforeEach(async () => {
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

    await flushPromises()
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

  it('外部リンクが表示されること', () => {
    expect(wrapper.findComponent({ ref: 'linkCategoriesShow' }).props().to).toBe('/categories/1')
    expect(wrapper.findComponent({ ref: 'linkCategoriesShow' }).text()).toBe('カテゴリー情報へ')
    expect(wrapper.findComponent({ ref: 'linkCategories' }).props().to).toBe('/categories')
    expect(wrapper.findComponent({ ref: 'linkCategories' }).text()).toBe('カテゴリーリストへ')
  })

  it('「カテゴリー名」と「概要」の値が表示されること', () => {
    expect(wrapper.vm.category.item).toBe('めっき')
    expect(wrapper.vm.category.summary).toBe('金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。')    
  })
})

describe('カテゴリー情報の取得に成功した場合', () => {
  it('カテゴリー名と概要が表示されること', async () => {
    axios.get.mockResolvedValue({
      data: {
        id: 1,
        item: 'sample category',
        summary: 'sample summary'
      }
    })

    const wrapper = mount(CategoriesEditView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub 
        }
      }
    })

    await flushPromises()

    expect(wrapper.find('#category_item').element.value).toBe('sample category')
    expect(wrapper.find('#category_summary').element.value).toBe('sample summary')
  })
})

describe('カテゴリー情報の取得に失敗した場合', () => {
  it('404ページに遷移すること', async () => {
    axios.get.mockRejectedValue({
      response: {
        status: 404
      }
    })

    const wrapper = mount(CategoriesEditView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    await flushPromises()

    expect(wrapper.emitted()).toHaveProperty('message')
    expect(wrapper.emitted().message[0]).toEqual([
      { type: 'danger', text: 'カテゴリー情報の取得に失敗しました。' }
    ])
    expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
  })
})


describe('有効なデータを入力して更新ボタンを押した場合', () => {
  it('更新が成功してカテゴリー情報のページに遷移すること', async () => {
    axios.get.mockResolvedValue({
      data: {
        id: 1,
        item: 'めっき',
        summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      }
    })

    axios.patch.mockResolvedValue({
      data: {
        id: 1,
        item: 'めっき（更新後）',
        summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
      }
    })

    const wrapper = mount(CategoriesEditView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    await flushPromises()

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted()).toHaveProperty('message')
    expect(wrapper.emitted().message[0]).toEqual([
      { type: 'success', text: 'カテゴリー情報を更新しました。' }
    ])
    expect(pushMock).toHaveBeenCalledWith('/categories/1')
  })
})

describe('無効なデータを入力して更新ボタンを押した場合', () => {
  it('入力不備のメッセージが表示されること', async () => {
    axios.patch.mockRejectedValue(new Error('Invalid credentials'))

    const wrapper = mount(CategoriesEditView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    await flushPromises()

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('入力に不備があります。')
  })
})
