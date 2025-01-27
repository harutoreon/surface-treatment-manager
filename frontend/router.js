import { createRouter, createWebHistory } from "vue-router"

import LoginView from './src/components/LoginView.vue'
import SamplesView from './src/components/SamplesView.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/about', component: SamplesView}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
