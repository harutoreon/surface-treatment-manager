import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

import LoginForm from '@/components/LoginForm.vue'
import HomeView from '@/components/HomeView.vue'
import SettingsView from '@/components/SettingsView.vue'
import UsersIndexView from '@/components/users/UsersIndexView.vue'
import UsersShowView from '@/components/users/UsersShowView.vue'
import UsersNewView from '@/components/users/UsersNewView.vue'
import UsersEditView from '@/components/users/UsersEditView.vue'
import CategoriesIndexView from '@/components/categories/CategoriesIndexView.vue'
import CategoriesShowView from './components/categories/CategoriesShowView.vue'
import CategoriesNewView from './components/categories/CategoriesNewView.vue'
import CategoriesEditView from './components/categories/CategoriesEditView.vue'
import MakersIndexView from './components/makers/MakersIndexView.vue'
import MakersShowView from './components/makers/MakersShowView.vue'
import MakersNewView from './components/makers/MakersNewView.vue'
import MakersEditView from './components/makers/MakersEditView.vue'
import SamplesIndexView from './components/samples/SamplesIndexView.vue'
import SamplesShowView from './components/samples/SamplesShowView.vue'
import SamplesNewView from './components/samples/SamplesNewView.vue'
import SamplesEditView from './components/samples/SamplesEditView.vue'
import StaticPagesNameView from './components/static_pages/StaticPagesNameView.vue'
import StaticPagesCategoryView from './components/static_pages/StaticPagesCategoryView.vue'
import StaticPagesMakerView from './components/static_pages/StaticPagesMakerView.vue'
import SearchResultsView from './components/search_results/SearchResultsView.vue'
import SearchResultsListView from './components/search_results/SearchResultsListView.vue'
import NotFound from './components/NotFound.vue'

const history = import.meta.env.MODE === 'test' ? createMemoryHistory() : createWebHistory()

const routes = [
  { path: '/', component: LoginForm, meta: { title: 'Login' } },
  { path: '/home', component: HomeView, meta: { title: 'Home' } },
  { path: '/settings', component: SettingsView, meta: { title: 'Settings' }  },
  { path: '/users', component: UsersIndexView, meta: { title: 'User Index' } },
  { path: '/users/:id', component: UsersShowView, meta: { title: 'User Show' } },
  { path: '/users/new', component: UsersNewView, meta: { title: 'User New' } },
  { path: '/users/:id/edit', component: UsersEditView, meta: { title: 'User Edit' } },
  { path: '/categories', component: CategoriesIndexView, meta: { title: 'Category Index' } },
  { path: '/categories/:id', component: CategoriesShowView, meta: { title: 'Category Show' } },
  { path: '/categories/new', component: CategoriesNewView, meta: { title: 'Category New' } },
  { path: '/categories/:id/edit', component: CategoriesEditView, meta: { title: 'Category Edit' } },
  { path: '/makers', component: MakersIndexView, meta: { title: 'Maker Index' } },
  { path: '/makers/:id', component: MakersShowView, meta: { title: 'Maker Show' } },
  { path: '/makers/new', component: MakersNewView, meta: { title: 'Maker New' } },
  { path: '/makers/:id/edit', component: MakersEditView, meta: { title: 'Maker Edit' } },
  { path: '/samples', component: SamplesIndexView, meta: { title: 'Sample Index' }},
  { path: '/samples/:id', component: SamplesShowView, meta: { title: 'Sample Show' } },
  { path: '/samples/new', component: SamplesNewView, meta: { title: 'Sample New' } },
  { path: '/samples/:id/edit', component: SamplesEditView, meta: { title: 'Sample Edit' } },
  { path: '/static_pages/name', component: StaticPagesNameView, meta: { title: 'Static Pages Name' } },
  { path: '/static_pages/category', component: StaticPagesCategoryView, meta: { title: 'Static Pages Category' } },
  { path: '/static_pages/maker', component: StaticPagesMakerView, meta: { title: 'Static Pages Maker' } },
  {
    path: '/static_pages/:searchMethod(name|category|maker)/search_results',
    name: 'SearchResults',
    component: SearchResultsView,
    meta: { title: "Search Results" }
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
