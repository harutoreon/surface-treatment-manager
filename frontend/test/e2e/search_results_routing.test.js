import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import searchResultRoutes from '@/router/routes/search_results'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [...searchResultRoutes]
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta?.title || defaultTitle
})

describe('Search Results routing', () => {
  describe('パラメータにnameを指定した場合', () => {
    it('nameを含むパスの「表面処理の検索結果」ページに遷移すること', async () => {
      await router.push({
        name: 'SearchResults',
        params: { searchMethod: 'name' },
        query: { keyword: 'めっき' }
      })

      expect(router.currentRoute.value.meta.title).toBe('Search Results')
      expect(document.title).toBe('Search Results')
    })
  })

  describe('パラメータにcategoryを指定した場合', () => {
    it('categoryを含むパスの「表面処理の検索結果」ページに遷移すること', async () => {
      await router.push({
        name: 'SearchResults',
        params: { searchMethod: 'category' },
        query: { keyword: 'めっき' }
      })

      expect(router.currentRoute.value.meta.title).toBe('Search Results')
      expect(document.title).toBe('Search Results')
    })
  })

  describe('パラメータにmakerを指定した場合', () => {
    it('makerを含むパスの「表面処理の検索結果」ページに遷移すること', async () => {
      await router.push({
        name: 'SearchResults',
        params: { searchMethod: 'maker' },
        query: { keyword: '株式会社' }
      })

      expect(router.currentRoute.value.meta.title).toBe('Search Results')
      expect(document.title).toBe('Search Results')
    })
  })
})

describe('Search Results List routing', () => {
  it('「表面処理一覧」ページに遷移すること', async () => {
    await router.push('/list_search_results')

    expect(router.currentRoute.value.meta.title).toBe('Search Results')
    expect(document.title).toBe('Search Results')
  })
})
