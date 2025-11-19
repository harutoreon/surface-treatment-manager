import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

import categoryRoutes from './routes/categories'
import commentRoutes from './routes/comments'
import departmentRoutes from './routes/departments'
import makerRoutes from './routes/makers'
import sampleRoutes from './routes/samples'
import userRoutes from './routes/users'
import sessionRoutes from './routes/sessions'
import settingsRoutes from './routes/settings'
import searchResultRoutes from './routes/search_results'
import staticPageRoutes from './routes/static_pages'
import notFoundRoute from './routes/not_found'

const history = import.meta.env.MODE === 'test' ? createMemoryHistory() : createWebHistory()

const routes = [
  ...categoryRoutes,
  ...commentRoutes,
  ...departmentRoutes,
  ...makerRoutes,
  ...sampleRoutes,
  ...userRoutes,
  ...sessionRoutes,
  ...settingsRoutes,
  ...searchResultRoutes,
  ...staticPageRoutes,
  ...notFoundRoute,
]

const router = createRouter({
  history,
  routes
})

router.afterEach((to) => {
  const defaultTitle = 'surface-treatment-manager'
  document.title = to.meta.title || defaultTitle  
})

export default router
