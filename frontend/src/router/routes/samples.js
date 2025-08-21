const SamplesIndexView = () => import('@/components/samples/SamplesIndexView.vue')
const SamplesShowView = () => import('@/components/samples/SamplesShowView.vue')
const SamplesNewView = () => import('@/components/samples/SamplesNewView.vue')
const SamplesEditView = () => import('@/components/samples/SamplesEditView.vue')

export default [
  {
    path: '/samples',
    component: SamplesIndexView,
    meta: { title: 'Sample Index' }
  },
  {
    path: '/samples/:id',
    component: SamplesShowView,
    meta: { title: 'Sample Show' }
  },
  {
    path: '/samples/new',
    component: SamplesNewView,
    meta: { title: 'Sample New' }
  },
  {
    path: '/samples/:id/edit',
    component: SamplesEditView,
    meta: { title: 'Sample Edit' }
  },
]
