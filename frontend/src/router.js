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
  { path: '/makers/1', component: MakersShowView },
]

const router = createRouter({
  history,
  routes
})

export default router
