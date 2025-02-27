import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

import LoginForm from '@/components/LoginForm.vue'
import HomeView from '@/components/HomeView.vue'
import SettingsView from '@/components/SettingsView.vue'
import UsersIndexView from '@/components/UsersIndexView.vue'
import UsersShowView from '@/components/UsersShowView.vue'
import UsersNewView from './components/UsersNewView.vue'

const history = import.meta.env.MODE === 'test' ? createMemoryHistory() : createWebHistory()

const routes = [   
  { path: '/', component: LoginForm },
  { path: '/home', component: HomeView },
  { path: '/settings', component: SettingsView },
  { path: '/users', component: UsersIndexView },
  { path: '/users/:id', component: UsersShowView },
  { path: '/users/new', component: UsersNewView },
]

const router = createRouter({
  history,
  routes
})

export default router
