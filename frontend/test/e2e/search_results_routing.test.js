import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import searchResultRoutes from '@/router/routes/search_results'
import App from '@/App.vue'

const routes = [
  ...searchResultRoutes,
]

function createAppRouter() {
  const history = createMemoryHistory()
  const router = createRouter({
    history,
    routes,
  })

  router.afterEach((to) => {
    const defaultTitle = 'surface-treatment-manager'
    document.title = to.meta?.title || defaultTitle
  })

  return router
}

describe('Search Results routing', () => {
  let router

  beforeEach(() => {
    router = createAppRouter()
  })

  describe('パラメータにnameを指定した場合', () => {
    it('nameを含むパスの「表面処理の検索結果」ページに遷移すること', async () => {
      router.push({
        name: 'SearchResults',
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      await router.isReady()

      const wrapper = mount(App, {
        global: {
          plugins: [router],
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(router.currentRoute.value.meta.title).toBe('Search Results')
      expect(document.title).toBe('Search Results')
      expect(wrapper.find('h3').text()).toBe('表面処理の検索結果')
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

      await router.isReady()

      const wrapper = mount(App, {
        global: {
          plugins: [router],
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(router.currentRoute.value.meta.title).toBe('Search Results')
      expect(document.title).toBe('Search Results')
      expect(wrapper.find('h3').text()).toBe('表面処理の検索結果')
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

      await router.isReady()

      const wrapper = mount(App, {
        global: {
          plugins: [router],
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      await flushPromises()

      expect(router.currentRoute.value.meta.title).toBe('Search Results')
      expect(document.title).toBe('Search Results')
      expect(wrapper.find('h3').text()).toBe('表面処理の検索結果')
      expect(wrapper.findComponent('#link_research').props().to).toBe('/static_pages/maker')
    })
  })

  it('「表面処理一覧」ページに遷移すること', async () => {
    router.push('/list_search_results')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Search Results')
    expect(document.title).toBe('Search Results')
    expect(wrapper.find('h3').text()).toBe('表面処理一覧')
  })
})
