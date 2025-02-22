import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

import LoginForm from '@/components/LoginForm.vue'
import HomeView from '@/components/HomeView.vue'
import SettingsView from '@/components/SettingsView.vue'


const history = import.meta.env.MODE === 'test' ? createMemoryHistory() : createWebHistory()

const routes = [   
  { path: '/', component: LoginForm },
  { path: '/home', component: HomeView },
  { path: '/settings', component: SettingsView },
]

const router = createRouter({
  history,
  routes
})

export default router
