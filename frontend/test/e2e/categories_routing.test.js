import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import categoryRoutes from '@/router/routes/categories'
import App from '@/App.vue'

const routes = [
  ...categoryRoutes,
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

let router

beforeEach(() => {
  router = createAppRouter()
})

describe('Categories routing', () => {
  it('「カテゴリーリスト」ページに遷移できること', async () => {
    router.push('/categories')

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

    expect(router.currentRoute.value.meta.title).toBe('Category Index')
    expect(document.title).toBe('Category Index')
    expect(wrapper.find('h3').text()).toBe('カテゴリーリスト')
  })

  it('「カテゴリー情報」ページに遷移できること', async () => {
    router.push('/categories/1')

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

    expect(router.currentRoute.value.meta.title).toBe('Category Show')
    expect(document.title).toBe('Category Show')
    expect(wrapper.find('h3').text()).toBe('カテゴリー情報')
  })

  it('「カテゴリー情報の登録」ページに遷移できること', async () => {
    router.push('/categories/new')

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

    expect(router.currentRoute.value.meta.title).toBe('Category New')
    expect(document.title).toBe('Category New')
    expect(wrapper.find('h3').text()).toBe('カテゴリー情報の登録')
  })

  it('「カテゴリー情報の編集」ページに遷移できること', async () => {
    router.push('/categories/1/edit')

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

    expect(router.currentRoute.value.meta.title).toBe('Category Edit')
    expect(document.title).toBe('Category Edit')
    expect(wrapper.find('h3').text()).toBe('カテゴリー情報の編集')
  })
})
