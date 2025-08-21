import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import sampleRoutes from '@/router/routes/samples'
import App from '@/App.vue'

const routes = [
  ...sampleRoutes,
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

describe('Samples routing', () => {
  let router

  beforeEach(() => {
    router = createAppRouter()
  })

  it('「表面処理リスト」ページに遷移すること', async () => {
    router.push('/samples')

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

    expect(router.currentRoute.value.meta.title).toBe('Sample Index')
    expect(document.title).toBe('Sample Index')
    expect(wrapper.find('h3').text()).toBe('表面処理リスト')
  })

  it('「表面処理情報」ページに遷移すること', async () => {
    router.push('/samples/1')

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

    expect(router.currentRoute.value.meta.title).toBe('Sample Show')
    expect(document.title).toBe('Sample Show')
    expect(wrapper.find('h3').text()).toBe('表面処理情報')
  })

  it('「表面処理情報の登録」ページに遷移すること', async () => { 
    router.push('/samples/new')

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
    expect(router.currentRoute.value.meta.title).toBe('Sample New')
    expect(document.title).toBe('Sample New')
    expect(wrapper.find('h3').text()).toBe('表面処理情報の登録')
  })

  it('「表面処理情報の編集」ページに遷移すること', async () => {
    router.push('/samples/1/edit')

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

    expect(router.currentRoute.value.meta.title).toBe('Sample Edit')
    expect(document.title).toBe('Sample Edit')
    expect(wrapper.find('h3').text()).toBe('表面処理情報の編集')
  })
})
