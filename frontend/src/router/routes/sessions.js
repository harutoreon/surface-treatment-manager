const LoginView = () => import('@/components/sessions/LoginView.vue')

export default [
  { path: '/',
    component: LoginView,
    meta: { title: 'Login' }
  },
]
