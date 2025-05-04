import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import App from '@/App.vue'
import router from '@/router'

describe('Makers routing', () => {
  it('「メーカーリスト」ページに遷移できること', async () => {
    router.push('/makers')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toContain('メーカーリスト')
  })

  it('「メーカー情報」ページに遷移できること', async () => {
    router.push('/makers/1')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toContain('メーカー情報')
  })

  it('「メーカー情報の新規登録」ページに遷移すること', async () => {
    router.push('/makers/new')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toContain('メーカー情報の登録')
  })

  it('「メーカー情報の編集」ページに遷移すること', async () => {
    router.push('/makers/1/edit')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.html()).toContain('メーカー情報の編集')
  })
})

describe('Samples routing', () => {
  it('「表面処理リスト」ページに遷移すること', async () => {
    router.push('/samples')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.html()).toContain('表面処理リスト')
  })

  it('「表面処理情報」ページに遷移すること', async () => {
    router.push('/samples/1')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.html()).toContain('表面処理情報')
  })

  it('「表面処理情報の登録」ページに遷移すること', async () => { 
    router.push('/samples/new')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.html()).toContain('表面処理情報の登録')
  })

  it('「表面処理情報の編集」ページに遷移すること', async () => {
    router.push('/samples/1/edit')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.html()).toContain('表面処理情報の編集')
  })
})

describe('Static Pages routing', () => {
  it('「処理名で検索」ページに遷移すること', async () => {
    router.push('/static_pages/name')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.html()).toContain('処理名で検索')
  })

  it('「カテゴリーで検索」ページに遷移すること', async () => {
    router.push('/static_pages/category')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.html()).toContain('カテゴリーで検索')
  })

  describe('パラメータにnameを指定した場合', () => {
    it('nameを含むパスの「表面処理の検索結果」ページに遷移すること', async () => {
      router.push({
        name: 'SearchResults',
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      await flushPromises()

      const wrapper = mount(App, {
        global: {
          plugins: [router]
        }
      })

      await flushPromises()

      expect(wrapper.html()).toContain('表面処理の検索結果')
      expect(wrapper.findComponent('#link_research').props().to).toBe('/static_pages/name')
    })
  })

  describe('パラメータにcategoryを指定した場合', () => {
    it('categoryを含むパスの「表面処理の検索結果」ページに遷移すること', async () => {
      router.push({
        name: 'SearchResults',
        params: { searchMethod: 'category' },
        query: { keyword: 'めっき' }
      })

      await flushPromises()

      const wrapper = mount(App, {
        global: {
          plugins: [router]
        }
      })

      await flushPromises()

      expect(wrapper.html()).toContain('表面処理の検索結果')
      expect(wrapper.findComponent('#link_research').props().to).toBe('/static_pages/category')
    })
  })
})
