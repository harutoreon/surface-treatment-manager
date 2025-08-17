import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import App from '@/App.vue'

const routes = [
  { path: '/', component: () => import('@/components/sessions/LoginView.vue'), meta: { title: 'Login' } },
  { path: '/home', component: () => import('@/components/static_pages/HomeView.vue'), meta: { title: 'Home' } },
  { path: '/settings', component: () => import('@/components/settings/SettingsView.vue'), meta: { title: 'Settings' }  },
  { path: '/users', component: () => import('@/components/users/UsersIndexView.vue'), meta: { title: 'User Index' } },
  { path: '/users/:id', component: () => import('@/components/users/UsersShowView.vue'), meta: { title: 'User Show' } },
  { path: '/users/new', component: () => import('@/components/users/UsersNewView.vue'), meta: { title: 'User New' } },
  { path: '/users/:id/edit', component: () => import('@/components/users/UsersEditView.vue'), meta: { title: 'User Edit' } },
  { path: '/categories', component: () => import('@/components/categories/CategoriesIndexView.vue'), meta: { title: 'Category Index' } },
  { path: '/categories/:id', component: () => import('@/components/categories/CategoriesShowView.vue'), meta: { title: 'Category Show' } },
  { path: '/categories/new', component: () => import('@/components/categories/CategoriesNewView.vue'), meta: { title: 'Category New' } },
  { path: '/categories/:id/edit', component: () => import('@/components/categories/CategoriesEditView.vue'), meta: { title: 'Category Edit' } },
  { path: '/makers', component: () => import('@/components/makers/MakersIndexView.vue'), meta: { title: 'Maker Index' } },
  { path: '/makers/:id', component: () => import('@/components/makers/MakersShowView.vue'), meta: { title: 'Maker Show' } },
  { path: '/makers/new', component: () => import('@/components/makers/MakersNewView.vue'), meta: { title: 'Maker New' } },
  { path: '/makers/:id/edit', component: () => import('@/components/makers/MakersEditView.vue'), meta: { title: 'Maker Edit' } },
  { path: '/samples', component: () => import('@/components/samples/SamplesIndexView.vue'), meta: { title: 'Sample Index' }},
  { path: '/samples/:id', component: () => import('@/components/samples/SamplesShowView.vue'), meta: { title: 'Sample Show' } },
  { path: '/samples/new', component: () => import('@/components/samples/SamplesNewView.vue'), meta: { title: 'Sample New' } },
  { path: '/samples/:id/edit', component: () => import('@/components/samples/SamplesEditView.vue'), meta: { title: 'Sample Edit' } },
  { path: '/static_pages/name', component: () => import('@/components/static_pages/StaticPagesNameView.vue'), meta: { title: 'Static Pages Name' } },
  { path: '/static_pages/category', component: () => import('@/components/static_pages/StaticPagesCategoryView.vue'), meta: { title: 'Static Pages Category' } },
  { path: '/static_pages/maker', component: () => import('@/components/static_pages/StaticPagesMakerView.vue'), meta: { title: 'Static Pages Maker' } },
  {
    path: '/static_pages/:searchMethod(name|category|maker)/search_results',
    name: 'SearchResults',
    component: () => import('@/components/search_results/SearchResultsView.vue'),
    meta: { title: 'Search Results' }
  },
  { path: '/list_search_results', component: () => import('@/components/search_results/SearchResultsListView.vue'), meta: { title: 'Search Results' } },
  { path: '/departments', component: () => import('@/components/departments/DepartmentsIndexView.vue'), meta: { title: 'Department Index' } },
  { path: '/departments/:id', component: () => import('@/components/departments/DepartmentsShowView.vue'), meta: { title: 'Department Show' } },
  { path: '/departments/new', component: () => import('@/components/departments/DepartmentsNewView.vue'), meta: { title: 'Department New' } },
  { path: '/departments/:id/edit', component: () => import('@/components/departments/DepartmentsEditView.vue'), meta: { title: 'Department edit' } },
  { path: '/comments', component: () => import('@/components/comments/CommentsIndexView.vue'), meta: { title: 'Comments Index' } },
  { path: '/comments/:id', component: () => import('@/components/comments/CommentsShowView.vue'), meta: { title: 'Comments Show' } },
  { path: '/comments/new', component: () => import('@/components/comments/CommentsNewView.vue'), meta: { title: 'Comments New' } },
  { path: '/comments/:id/edit', component: () => import('@/components/comments/CommentsEditView.vue'), meta: { title: 'Comments Edit' } },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/components/not_found/NotFound.vue'), meta: { title: 'NotFound (404)' } },
]

function createAppRouter() {
  const history = import.meta.env.MODE === 'test' ? createMemoryHistory() : createWebHistory()
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

describe('Login routing', () => {
  it('「ログイン」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
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
    const router = createAppRouter()

    router.push('/home')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
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
    const router = createAppRouter()

    router.push('/settings')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
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
    const router = createAppRouter()

    router.push('/users')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('User Index')
    expect(document.title).toBe('User Index')
    expect(wrapper.find('h3').text()).toBe('ユーザーリスト')
  })

  it('「ユーザー情報」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/users/1')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('User Show')
    expect(document.title).toBe('User Show')
    expect(wrapper.find('h3').text()).toBe('ユーザー情報')
  })

  it('「ユーザー情報の登録」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/users/new')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('User New')
    expect(document.title).toBe('User New')
    expect(wrapper.find('h3').text()).toBe('ユーザー情報の登録')
  })

  it('「ユーザー情報の編集」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/users/1/edit')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
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
    const router = createAppRouter()

    router.push('/categories')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Category Index')
    expect(document.title).toBe('Category Index')
    expect(wrapper.find('h3').text()).toBe('カテゴリーリスト')
  })

  it('「カテゴリー情報」ページに遷移できること', async () => {
    const router = createAppRouter()

    router.push('/categories/1')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Category Show')
    expect(document.title).toBe('Category Show')
    expect(wrapper.find('h3').text()).toBe('カテゴリー情報')
  })

  it('「カテゴリー情報の登録」ページに遷移できること', async () => {
    const router = createAppRouter()

    router.push('/categories/new')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Category New')
    expect(document.title).toBe('Category New')
    expect(wrapper.find('h3').text()).toBe('カテゴリー情報の登録')
  })

  it('「カテゴリー情報の編集」ページに遷移できること', async () => {
    const router = createAppRouter()

    router.push('/categories/1/edit')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
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
    const router = createAppRouter()

    router.push('/makers')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Maker Index')
    expect(document.title).toBe('Maker Index')
    expect(wrapper.find('h3').text()).toBe('メーカーリスト')
  })

  it('「メーカー情報」ページに遷移できること', async () => {
    const router = createAppRouter()

    router.push('/makers/1')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Maker Show')
    expect(document.title).toBe('Maker Show')
    expect(wrapper.find('h3').text()).toBe('メーカー情報')
  })

  it('「メーカー情報の登録」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/makers/new')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Maker New')
    expect(document.title).toBe('Maker New')
    expect(wrapper.find('h3').text()).toBe('メーカー情報の登録')
  })

  it('「メーカー情報の編集」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/makers/1/edit')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Maker Edit')
    expect(document.title).toBe('Maker Edit')
    expect(wrapper.find('h3').text()).toBe('メーカー情報の編集')
  })
})

describe('Samples routing', () => {
  it('「表面処理リスト」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/samples')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Sample Index')
    expect(document.title).toBe('Sample Index')
    expect(wrapper.find('h3').text()).toBe('表面処理リスト')
  })

  it('「表面処理情報」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/samples/1')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Sample Show')
    expect(document.title).toBe('Sample Show')
    expect(wrapper.find('h3').text()).toBe('表面処理情報')
  })

  it('「表面処理情報の登録」ページに遷移すること', async () => { 
    const router = createAppRouter()

    router.push('/samples/new')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()
    expect(router.currentRoute.value.meta.title).toBe('Sample New')
    expect(document.title).toBe('Sample New')
    expect(wrapper.find('h3').text()).toBe('表面処理情報の登録')
  })

  it('「表面処理情報の編集」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/samples/1/edit')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
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
    const router = createAppRouter()

    router.push('/static_pages/name')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Static Pages Name')
    expect(document.title).toBe('Static Pages Name')
    expect(wrapper.find('h3').text()).toBe('処理名で検索')
  })

  it('「カテゴリーで検索」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/static_pages/category')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Static Pages Category')
    expect(document.title).toBe('Static Pages Category')
    expect(wrapper.find('h3').text()).toBe('カテゴリーで検索')
  })

  it('「メーカー名で検索」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/static_pages/maker')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Static Pages Maker')
    expect(document.title).toBe('Static Pages Maker')
    expect(wrapper.find('h3').text()).toBe('メーカー名で検索')
  })
})

describe('Search Results routing', () => {
  describe('パラメータにnameを指定した場合', () => {
    it('nameを含むパスの「表面処理の検索結果」ページに遷移すること', async () => {
      const router = createAppRouter()

      router.push({
        name: 'SearchResults',
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      await router.isReady()

      const wrapper = mount(App, {
        global: {
          plugins: [router],
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
      const router = createAppRouter()

      router.push({
        name: 'SearchResults',
        params: { searchMethod: 'category' },
        query: { keyword: 'めっき' }
      })

      await router.isReady()

      const wrapper = mount(App, {
        global: {
          plugins: [router],
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
      const router = createAppRouter()

      router.push({
        name: 'SearchResults',
        params: { searchMethod: 'maker' },
        query: { keyword: '株式会社' }
      })

      await router.isReady()

      const wrapper = mount(App, {
        global: {
          plugins: [router],
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
    const router = createAppRouter()

    router.push('/list_search_results')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Search Results')
    expect(document.title).toBe('Search Results')
    expect(wrapper.find('h3').text()).toBe('表面処理一覧')
  })
})

describe('Departments routing', () => {
  it('「部署リスト」ページに遷移できること', async () => {
    const router = createAppRouter()

    router.push('/departments')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Department Index')
    expect(document.title).toBe('Department Index')
    expect(wrapper.find('h3').text()).toBe('部署リスト')
  })

  it('「部署情報」ページに遷移できること', async () => {
    const router = createAppRouter()

    router.push('/departments/1')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Department Show')
    expect(document.title).toBe('Department Show')
    expect(wrapper.find('h3').text()).toBe('部署情報')
  })

  it('「部署情報の登録」ページに遷移できること', async () => {
    const router = createAppRouter()

    router.push('/departments/new')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Department New')
    expect(document.title).toBe('Department New')
    expect(wrapper.find('h3').text()).toBe('部署情報の登録')
  })

  it('「部署情報の編集」ページに遷移できること', async () => {
    const router = createAppRouter()

    router.push('/departments/1/edit')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Department edit')
    expect(document.title).toBe('Department edit')
    expect(wrapper.find('h3').text()).toBe('部署情報の編集')
  })
})

describe('Comments routing', () => {
  it('「コメントリスト」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/comments')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Comments Index')
    expect(document.title).toBe('Comments Index')
    expect(wrapper.find('h3').text()).toBe('コメントリスト') 
  })

  it('「コメント情報」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/comments/1')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Comments Show')
    expect(document.title).toBe('Comments Show')
    expect(wrapper.find('h3').text()).toBe('コメント情報') 
  })

  it('「コメント情報の新規登録」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/comments/new')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Comments New')
    expect(document.title).toBe('Comments New')
    expect(wrapper.find('h3').text()).toBe('コメント情報の新規登録') 
  })

  it('「コメント情報の編集」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/comments/1/edit')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('Comments Edit')
    expect(document.title).toBe('Comments Edit')
    expect(wrapper.find('h3').text()).toBe('コメント情報の編集') 
  })
})

describe('NotFound routing', () => {
  it('「404」ページに遷移すること', async () => {
    const router = createAppRouter()

    router.push('/non-existent-path')

    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      }
    })

    await flushPromises()

    expect(router.currentRoute.value.meta.title).toBe('NotFound (404)')
    expect(document.title).toBe('NotFound (404)')
    expect(wrapper.find('h1').text()).toBe('404')
  })
})
