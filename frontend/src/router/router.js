import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

import categoryRoutes from './routes/categories'
import commentRoutes from './routes/comments'
import departmentRoutes from './routes/departments'
import makerRoutes from './routes/makers'
import sampleRoutes from './routes/samples'
import userRoutes from './routes/users'
import sessionRoutes from './routes/sessions'
import settingsRoutes from './routes/settings'

import HomeView from '@/components/static_pages/HomeView.vue'
import StaticPagesNameView from '@/components/static_pages/StaticPagesNameView.vue'
import StaticPagesCategoryView from '@/components/static_pages/StaticPagesCategoryView.vue'
import StaticPagesMakerView from '@/components/static_pages/StaticPagesMakerView.vue'
import SearchResultsView from '@/components/search_results/SearchResultsView.vue'
import SearchResultsListView from '@/components/search_results/SearchResultsListView.vue'

import NotFound from '@/components/not_found/NotFound.vue'

const history = import.meta.env.MODE === 'test' ? createMemoryHistory() : createWebHistory()

const routes = [
  { path: '/home', component: HomeView, meta: { title: 'Home' } },
  ...categoryRoutes,
  ...commentRoutes,
  ...departmentRoutes,
  ...makerRoutes,
  ...sampleRoutes,
  ...userRoutes,
  ...sessionRoutes,
  ...settingsRoutes,
  { path: '/static_pages/name', component: StaticPagesNameView, meta: { title: 'Static Pages Name' } },
  { path: '/static_pages/category', component: StaticPagesCategoryView, meta: { title: 'Static Pages Category' } },
  { path: '/static_pages/maker', component: StaticPagesMakerView, meta: { title: 'Static Pages Maker' } },
  {
    path: '/static_pages/:searchMethod(name|category|maker)/search_results',
    name: 'SearchResults',
    component: SearchResultsView,
    meta: { title: 'Search Results' }
  },
  { path: '/list_search_results', component: SearchResultsListView, meta: { title: 'Search Results' } },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: 'NotFound (404)' } },
]

const router = createRouter({
  history,
  routes
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta.title || defaultTitle  
})

export default router
