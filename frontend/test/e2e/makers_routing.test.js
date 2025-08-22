import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import makerRoutes from '@/router/routes/makers'
import App from '@/App.vue'

const routes = [
  ...makerRoutes,
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

describe('Makers routing', () => {
  let router

  beforeEach(() => {
    router = createAppRouter()
  })

  it('「メーカーリスト」ページに遷移できること', async () => {
    router.push('/makers')

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

    expect(router.currentRoute.value.meta.title).toBe('Maker Index')
    expect(document.title).toBe('Maker Index')
    expect(wrapper.find('h3').text()).toBe('メーカーリスト')
  })

  it('「メーカー情報」ページに遷移できること', async () => {
    router.push('/makers/1')

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

    expect(router.currentRoute.value.meta.title).toBe('Maker Show')
    expect(document.title).toBe('Maker Show')
    expect(wrapper.find('h3').text()).toBe('メーカー情報')
  })

  it('「メーカー情報の登録」ページに遷移すること', async () => {
    router.push('/makers/new')

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

    expect(router.currentRoute.value.meta.title).toBe('Maker New')
    expect(document.title).toBe('Maker New')
    expect(wrapper.find('h3').text()).toBe('メーカー情報の登録')
  })

  it('「メーカー情報の編集」ページに遷移すること', async () => {
    router.push('/makers/1/edit')

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

    expect(router.currentRoute.value.meta.title).toBe('Maker Edit')
    expect(document.title).toBe('Maker Edit')
    expect(wrapper.find('h3').text()).toBe('メーカー情報の編集')
  })
})
