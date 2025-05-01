import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

import LoginForm from '@/components/LoginForm.vue'
import HomeView from '@/components/HomeView.vue'
import SettingsView from '@/components/SettingsView.vue'
import UsersIndexView from '@/components/UsersIndexView.vue'
import UsersShowView from '@/components/UsersShowView.vue'
import UsersNewView from '@/components/UsersNewView.vue'
import UsersEditView from '@/components/UsersEditView.vue'
import CategoriesIndexView from '@/components/categories/CategoriesIndexView.vue'
import CategoriesShowView from './components/categories/CategoriesShowView.vue'
import CategoriesNewView from './components/categories/CategoriesNewView.vue'
import CategoriesEditView from './components/categories/CategoriesEditView.vue'
import MakersIndexView from './components/makers/MakersIndexView.vue'
import MakersShowView from './components/makers/MakersShowView.vue'
import MakersNewView from './components/makers/MakersNewView.vue'
import MakersEditView from './components/makers/MakersEditView.vue'
import NotFound from './components/NotFound.vue'
import SamplesIndexView from './components/samples/SamplesIndexView.vue'
import SamplesShowView from './components/samples/SamplesShowView.vue'
import SamplesNewView from './components/samples/SamplesNewView.vue'
import SamplesEditView from './components/samples/SamplesEditView.vue'
import StaticPagesNameView from './components/static_pages/StaticPagesNameView.vue'

const history = import.meta.env.MODE === 'test' ? createMemoryHistory() : createWebHistory()

const routes = [
  { path: '/', component: LoginForm },
  { path: '/home', component: HomeView },
  { path: '/settings', component: SettingsView },
  { path: '/users', component: UsersIndexView },
  { path: '/users/:id', component: UsersShowView },
  { path: '/users/new', component: UsersNewView },
  { path: '/users/:id/edit', component: UsersEditView },
  { path: '/categories', component: CategoriesIndexView },
  { path: '/categories/:id', component: CategoriesShowView },
  { path: '/categories/new', component: CategoriesNewView },
  { path: '/categories/:id/edit', component: CategoriesEditView },
  { path: '/makers', component: MakersIndexView },
  { path: '/makers/:id', component: MakersShowView },
  { path: '/makers/new', component: MakersNewView },
  { path: '/makers/:id/edit', component: MakersEditView },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound},
  { path: '/samples', component: SamplesIndexView},
  { path: '/samples/:id', component: SamplesShowView },
  { path: '/samples/new', component: SamplesNewView },
  { path: '/samples/:id/edit', component: SamplesEditView },
  { path: '/static_pages/name', component: StaticPagesNameView },
]

const router = createRouter({
  history,
  routes
})

export default router
