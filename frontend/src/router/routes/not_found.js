const NotFound = () => import('@/components/not_found/NotFound.vue')

export default [  
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'NotFound (404)' }
  },
]
