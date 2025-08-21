const DepartmentsIndexView = () => import('@/components/departments/DepartmentsIndexView.vue')
const DepartmentsShowView = () => import('@/components/departments/DepartmentsShowView.vue')
const DepartmentsNewView = () => import('@/components/departments/DepartmentsNewView.vue')
const DepartmentsEditView = () => import('@/components/departments/DepartmentsEditView.vue')

export default [
  {
    path: '/departments',
    component: DepartmentsIndexView,
    meta: { title: 'Department Index' }
  },
  {
    path: '/departments/:id',
    component: DepartmentsShowView,
    meta: { title: 'Department Show' }
  },
  {
    path: '/departments/new',
    component: DepartmentsNewView,
    meta: { title: 'Department New' }
  },
  {
    path: '/departments/:id/edit',
    component: DepartmentsEditView,
    meta: { title: 'Department Edit' }
  },
]
