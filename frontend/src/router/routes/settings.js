const SettingsView = () => import('@/components/settings/SettingsView.vue')

export default [
  {
    path: '/settings',
    component: SettingsView,
    meta: { title: 'Settings' }
  },
]
