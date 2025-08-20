const UsersIndexView = () => import('@/components/users/UsersIndexView.vue')
const UsersShowView = () => import('@/components/users/UsersShowView.vue')
const UsersNewView = () => import('@/components/users/UsersNewView.vue')
const UsersEditView = () => import('@/components/users/UsersEditView.vue')

export default [
  {
    path: '/users',
    component: UsersIndexView,
    meta: { title: 'User Index' }
  },
  {
    path: '/users/:id',
    component: UsersShowView,
    meta: { title: 'User Show' }
  },
  {
    path: '/users/new',
    component: UsersNewView,
    meta: { title: 'User New' }
  },
  {
    path: '/users/:id/edit',
    component: UsersEditView,
    meta: { title: 'User Edit' }
  },
]
