import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import commentRoutes from '@/router/routes/comments'
import App from '@/App.vue'

const routes = [
  ...commentRoutes,
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

describe('Comments routing', () => {
  let router

  beforeEach(() => {
    router = createAppRouter()
  })

  it('「コメントリスト」ページに遷移すること', async () => {
    router.push('/comments')

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

    expect(router.currentRoute.value.meta.title).toBe('Comments Index')
    expect(document.title).toBe('Comments Index')
    expect(wrapper.find('h3').text()).toBe('コメントリスト') 
  })

  it('「コメント情報」ページに遷移すること', async () => {
    router.push('/comments/1')

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

    expect(router.currentRoute.value.meta.title).toBe('Comments Show')
    expect(document.title).toBe('Comments Show')
    expect(wrapper.find('h3').text()).toBe('コメント情報') 
  })

  it('「コメント情報の新規登録」ページに遷移すること', async () => {
    router.push('/comments/new')

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

    expect(router.currentRoute.value.meta.title).toBe('Comments New')
    expect(document.title).toBe('Comments New')
    expect(wrapper.find('h3').text()).toBe('コメント情報の新規登録') 
  })

  it('「コメント情報の編集」ページに遷移すること', async () => {
    router.push('/comments/1/edit')

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

    expect(router.currentRoute.value.meta.title).toBe('Comments Edit')
    expect(document.title).toBe('Comments Edit')
    expect(wrapper.find('h3').text()).toBe('コメント情報の編集') 
  })
})
