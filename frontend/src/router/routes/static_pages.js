const HomeView = () => import('@/components/static_pages/HomeView.vue')
const StaticPagesNameView = () => import('@/components/static_pages/StaticPagesNameView.vue')
const StaticPagesCategoryView = () => import('@/components/static_pages/StaticPagesCategoryView.vue')
const StaticPagesMakerView = () => import('@/components/static_pages/StaticPagesMakerView.vue')

export default [
  {
    path: '/home',
    component: HomeView,
    meta: { title: 'Home' }
  },
  {
    path: '/static_pages/name',
    component: StaticPagesNameView,
    meta: { title: 'Static Pages Name' }
  },
  {
    path: '/static_pages/category',
    component: StaticPagesCategoryView,
    meta: { title: 'Static Pages Category' }
  },
  {
    path: '/static_pages/maker',
    component: StaticPagesMakerView,
    meta: { title: 'Static Pages Maker' }
  },
]
