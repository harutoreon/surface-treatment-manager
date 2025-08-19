const MakersIndexView = () => import('@/components/makers/MakersIndexView.vue')
const MakersShowView = () => import('@/components/makers/MakersShowView.vue')
const MakersNewView = () => import('@/components/makers/MakersNewView.vue')
const MakersEditView = () => import('@/components/makers/MakersEditView.vue')

export default [
  {
    path: '/makers',
    component: MakersIndexView,
    meta: { title: 'Maker Index' }
  },
  {
    path: '/makers/:id',
    component: MakersShowView,
    meta: { title: 'Maker Show' }
  },
  {
    path: '/makers/new',
    component: MakersNewView,
    meta: { title: 'Maker New' }
  },
  {
    path: '/makers/:id/edit',
    component: MakersEditView,
    meta: { title: 'Maker Edit' }
  },
]
