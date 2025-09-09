import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

axios.defaults.withCredentials = true

createApp(App)
  .use(router)
  .mount('#app')
