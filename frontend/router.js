import { createRouter, createWebHistory } from "vue-router"

import LoginForm from "@/components/LoginForm.vue"
import SamplesView from "@/components/SamplesView.vue"

const routes = [   
  { path: '/', component: LoginForm },
  { path: '/sample', component: SamplesView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
