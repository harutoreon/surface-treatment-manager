import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import staticPageRoutes from '@/router/routes/static_pages'
import App from '@/App.vue'

const routes = [
  ...staticPageRoutes,
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

describe('Static Pages routing', () => {
  let router

  beforeEach(() => {
    router = createAppRouter()
  })

  it('「メインメニュー」ページに遷移すること', async () => {
    router.push('/home')

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

    expect(router.currentRoute.value.meta.title).toBe('Home')
    expect(document.title).toBe('Home')
    expect(wrapper.find('h3').text()).toBe('メインメニュー')
  })

  it('「処理名で検索」ページに遷移すること', async () => {
    router.push('/static_pages/name')

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

    expect(router.currentRoute.value.meta.title).toBe('Static Pages Name')
    expect(document.title).toBe('Static Pages Name')
    expect(wrapper.find('h3').text()).toBe('処理名で検索')
  })

  it('「カテゴリーで検索」ページに遷移すること', async () => {
    router.push('/static_pages/category')

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

    expect(router.currentRoute.value.meta.title).toBe('Static Pages Category')
    expect(document.title).toBe('Static Pages Category')
    expect(wrapper.find('h3').text()).toBe('カテゴリーで検索')
  })

  it('「メーカー名で検索」ページに遷移すること', async () => {
    router.push('/static_pages/maker')

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

    expect(router.currentRoute.value.meta.title).toBe('Static Pages Maker')
    expect(document.title).toBe('Static Pages Maker')
    expect(wrapper.find('h3').text()).toBe('メーカー名で検索')
  })
})
