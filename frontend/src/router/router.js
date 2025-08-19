import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

import categoryRoutes from './routes/categories'
import commentRoutes from './routes/comments'
import departmentRoutes from './routes/departments'
import makerRoutes from './routes/makers'
import sampleRoutes from './routes/samples'

import LoginView from '@/components/sessions/LoginView.vue'
import HomeView from '@/components/static_pages/HomeView.vue'
import SettingsView from '@/components/settings/SettingsView.vue'
import UsersIndexView from '@/components/users/UsersIndexView.vue'
import UsersShowView from '@/components/users/UsersShowView.vue'
import UsersNewView from '@/components/users/UsersNewView.vue'
import UsersEditView from '@/components/users/UsersEditView.vue'
import StaticPagesNameView from '@/components/static_pages/StaticPagesNameView.vue'
import StaticPagesCategoryView from '@/components/static_pages/StaticPagesCategoryView.vue'
import StaticPagesMakerView from '@/components/static_pages/StaticPagesMakerView.vue'
import SearchResultsView from '@/components/search_results/SearchResultsView.vue'
import SearchResultsListView from '@/components/search_results/SearchResultsListView.vue'

import NotFound from '@/components/not_found/NotFound.vue'

const history = import.meta.env.MODE === 'test' ? createMemoryHistory() : createWebHistory()

const routes = [
  { path: '/', component: LoginView, meta: { title: 'Login' } },
  { path: '/home', component: HomeView, meta: { title: 'Home' } },
  { path: '/settings', component: SettingsView, meta: { title: 'Settings' }  },
  { path: '/users', component: UsersIndexView, meta: { title: 'User Index' } },
  { path: '/users/:id', component: UsersShowView, meta: { title: 'User Show' } },
  { path: '/users/new', component: UsersNewView, meta: { title: 'User New' } },
  { path: '/users/:id/edit', component: UsersEditView, meta: { title: 'User Edit' } },
  ...categoryRoutes,
  ...commentRoutes,
  ...departmentRoutes,
  ...makerRoutes,
  ...sampleRoutes,
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
