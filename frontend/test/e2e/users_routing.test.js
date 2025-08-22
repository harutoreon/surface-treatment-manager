import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import userRoutes from '@/router/routes/users'
import App from '@/App.vue'

const routes = [
  ...userRoutes,
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

describe('Users routing', () => {
  let router

  beforeEach(() => {
    router = createAppRouter()
  })

  it('「ユーザーリスト」ページに遷移すること', async () => {
    router.push('/users')

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

    expect(router.currentRoute.value.meta.title).toBe('User Index')
    expect(document.title).toBe('User Index')
    expect(wrapper.find('h3').text()).toBe('ユーザーリスト')
  })

  it('「ユーザー情報」ページに遷移すること', async () => {
    router.push('/users/1')

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

    expect(router.currentRoute.value.meta.title).toBe('User Show')
    expect(document.title).toBe('User Show')
    expect(wrapper.find('h3').text()).toBe('ユーザー情報')
  })

  it('「ユーザー情報の登録」ページに遷移すること', async () => {
    router.push('/users/new')

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

    expect(router.currentRoute.value.meta.title).toBe('User New')
    expect(document.title).toBe('User New')
    expect(wrapper.find('h3').text()).toBe('ユーザー情報の登録')
  })

  it('「ユーザー情報の編集」ページに遷移すること', async () => {
    router.push('/users/1/edit')

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

    expect(router.currentRoute.value.meta.title).toBe('User Edit')
    expect(document.title).toBe('User Edit')
    expect(wrapper.find('h3').text()).toBe('ユーザー情報の編集')
  })
})
