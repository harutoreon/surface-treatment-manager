const CommentsIndexView = () => import('@/components/comments/CommentsIndexView.vue')
const CommentsShowView = () => import('@/components/comments/CommentsShowView.vue')
const CommentsNewView = () => import('@/components/comments/CommentsNewView.vue')
const CommentsEditView = () => import('@/components/comments/CommentsEditView.vue')

export default [
  {
    path: '/comments',
    component: CommentsIndexView,
    meta: { title: 'Comments Index' }
  },
  {
    path: '/comments/:id',
    component: CommentsShowView,
    meta: { title: 'Comments Show' }
  },
  {
    path: '/comments/new',
    component: CommentsNewView,
    meta: { title: 'Comments New' }
  },
  {
    path: '/comments/:id/edit',
    component: CommentsEditView,
    meta: { title: 'Comments Edit' }
  },
]
