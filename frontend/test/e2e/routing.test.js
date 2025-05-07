import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import App from '@/App.vue'
import router from '@/router'

describe('Login routing', () => {
  it('「ログイン」ページに遷移すること', async () => {
    router.push('/')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Login')
    expect(document.title).toBe('Login')
    expect(wrapper.find('h3').text()).toBe('ログイン')
  })
})

describe('Home routing', () => {
  it('「メインメニュー」ページに遷移すること', async () => {
    router.push('/home')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Home')
    expect(document.title).toBe('Home')
    expect(wrapper.find('h3').text()).toBe('メインメニュー')
  })
})

describe('Settings routing', () => {
  it('「アプリケーションの管理」ページに遷移すること', async () => {
    router.push('/settings')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Settings')
    expect(document.title).toBe('Settings')
    expect(wrapper.find('h3').text()).toBe('アプリケーションの管理')
  })
})

describe('Users routing', () => {
  it('「ユーザーリスト」ページに遷移すること', async () => {
    router.push('/users')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('User Index')
    expect(document.title).toBe('User Index')
    expect(wrapper.find('h3').text()).toBe('ユーザーリスト')
  })

  it('「ユーザー情報」ページに遷移すること', async () => {
    router.push('/users/1')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('User Show')
    expect(document.title).toBe('User Show')
    expect(wrapper.find('h3').text()).toBe('ユーザー情報')
  })

  it('「ユーザー情報の登録」ページに遷移すること', async () => {
    router.push('/users/new')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('User New')
    expect(document.title).toBe('User New')
    expect(wrapper.find('h3').text()).toBe('ユーザー情報の登録')
  })

  it('「ユーザー情報の編集」ページに遷移すること', async () => {
    router.push('/users/1/edit')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('User Edit')
    expect(document.title).toBe('User Edit')
    expect(wrapper.find('h3').text()).toBe('ユーザー情報の編集')
  })
})

describe('Categories routing', () => {
  it('「カテゴリーリスト」ページに遷移できること', async () => {
    router.push('/categories')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Category Index')
    expect(document.title).toBe('Category Index')
    expect(wrapper.find('h3').text()).toBe('カテゴリーリスト')
  })

  it('「カテゴリー情報」ページに遷移できること', async () => {
    router.push('/categories/1')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Category Show')
    expect(document.title).toBe('Category Show')
    expect(wrapper.find('h3').text()).toBe('カテゴリー情報')
  })

  it('「カテゴリー情報の登録」ページに遷移できること', async () => {
    router.push('/categories/new')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Category New')
    expect(document.title).toBe('Category New')
    expect(wrapper.find('h3').text()).toBe('カテゴリー情報の登録')
  })

  it('「カテゴリー情報の編集」ページに遷移できること', async () => {
    router.push('/categories/1/edit')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Category Edit')
    expect(document.title).toBe('Category Edit')
    expect(wrapper.find('h3').text()).toBe('カテゴリー情報の編集')
  })
})

describe('Makers routing', () => {
  it('「メーカーリスト」ページに遷移できること', async () => {
    router.push('/makers')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Maker Index')
    expect(document.title).toBe('Maker Index')
    expect(wrapper.find('h3').text()).toBe('メーカーリスト')
  })

  it('「メーカー情報」ページに遷移できること', async () => {
    router.push('/makers/1')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Maker Show')
    expect(document.title).toBe('Maker Show')
    expect(wrapper.find('h3').text()).toBe('メーカー情報')
  })

  it('「メーカー情報の登録」ページに遷移すること', async () => {
    router.push('/makers/new')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Maker New')
    expect(document.title).toBe('Maker New')
    expect(wrapper.find('h3').text()).toBe('メーカー情報の登録')
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

    expect(router.currentRoute.value.meta.title).toBe('Maker Edit')
    expect(document.title).toBe('Maker Edit')
    expect(wrapper.find('h3').text()).toBe('メーカー情報の編集')
  })
})

describe('NotFound routing', () => {
  it('「404」ページに遷移すること', async () => {
    router.push('/non-existent-path')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('NotFound (404)')
    expect(document.title).toBe('NotFound (404)')
    expect(wrapper.find('h1').text()).toBe('404')
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

    expect(router.currentRoute.value.meta.title).toBe('Sample Index')
    expect(document.title).toBe('Sample Index')
    expect(wrapper.find('h3').text()).toBe('表面処理リスト')
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

    expect(router.currentRoute.value.meta.title).toBe('Sample Show')
    expect(document.title).toBe('Sample Show')
    expect(wrapper.find('h3').text()).toBe('表面処理情報')
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
    expect(router.currentRoute.value.meta.title).toBe('Sample New')
    expect(document.title).toBe('Sample New')
    expect(wrapper.find('h3').text()).toBe('表面処理情報の登録')
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

    expect(router.currentRoute.value.meta.title).toBe('Sample Edit')
    expect(document.title).toBe('Sample Edit')
    expect(wrapper.find('h3').text()).toBe('表面処理情報の編集')
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

  it('「メーカー名で検索」ページに遷移すること', async () => {
    router.push('/static_pages/maker')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.html()).toContain('メーカー名で検索')
  })
})

describe('Search Results routing', () => {
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

  describe('パラメータにmakerを指定した場合', () => {
    it('makerを含むパスの「表面処理の検索結果」ページに遷移すること', async () => {
      router.push({
        name: 'SearchResults',
        params: { searchMethod: 'maker' },
        query: { keyword: '株式会社' }
      })

      await flushPromises()

      const wrapper = mount(App, {
        global: {
          plugins: [router]
        }
      })

      await flushPromises()

      expect(wrapper.html()).toContain('表面処理の検索結果')
      expect(wrapper.findComponent('#link_research').props().to).toBe('/static_pages/maker')
    })
  })

  it('「表面処理一覧」ページに遷移すること', async () => {
    router.push('/list_search_results')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.html()).toContain('表面処理一覧')    
  })
})
