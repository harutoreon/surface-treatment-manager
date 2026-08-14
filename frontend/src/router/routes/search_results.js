const SearchResultsView = () => import('@/components/search_results/SearchResultsView.vue')
const SearchResultsListView = () => import('@/components/search_results/SearchResultsListView.vue')
const FilmThickness = () => import('@/components/search_results/FilmThickness.vue')

export default [
  {
    path: '/static_pages/:searchMethod(name|category|maker)/search_results',
    name: 'SearchResults',
    component: SearchResultsView,
    meta: { title: 'Search Results' }
  },
  {
    path: '/list_search_results',
    component: SearchResultsListView,
    meta: { title: 'Search Results' }
  },
  {
    path: '/static_pages/film_thickness/search_results',
    component: FilmThickness,
    meta: { title: 'Search Results' }
  },
]
