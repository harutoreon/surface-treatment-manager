import { createRouter, createWebHistory } from "vue-router"

import LoginForm from "@/components/LoginForm.vue"
import SamplesView from "@/components/SamplesView.vue"
import SettingsView from "@/components/SettingsView.vue"

const routes = [   
  { path: '/', component: LoginForm },
  { path: '/sample', component: SamplesView },
  { path: '/settings', component: SettingsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
