const CategoriesIndexView = () => import('@/components/categories/CategoriesIndexView.vue')
const CategoriesShowView = () => import('@/components/categories/CategoriesShowView.vue')
const CategoriesNewView = () => import('@/components/categories/CategoriesNewView.vue')
const CategoriesEditView = () => import('@/components/categories/CategoriesEditView.vue')

export default [
  { 
    path: '/categories',
    component: CategoriesIndexView,
    meta: { title: 'Category Index' },
  },
  {
    path: '/categories/:id',
    component: CategoriesShowView,
    meta: { title: 'Category Show' },
  },
  {
    path: '/categories/new',
    component: CategoriesNewView,
    meta: { title: 'Category New' }
  },
  {
    path: '/categories/:id/edit',
    component: CategoriesEditView,
    meta: { title: 'Category Edit' }
  },
]