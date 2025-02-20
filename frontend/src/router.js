import { createRouter, createWebHistory, createMemoryHistory } from "vue-router"

import LoginForm from "@/components/LoginForm.vue"
import SamplesView from "@/components/SamplesView.vue"
import SettingsView from "@/components/SettingsView.vue"

const history = import.meta.env.MODE === 'test' ? createMemoryHistory() : createWebHistory()

const routes = [   
  { path: '/', component: LoginForm },
  { path: '/sample', component: SamplesView },
  { path: '/settings', component: SettingsView }
]

const router = createRouter({
  history,
  routes
})

export default router
