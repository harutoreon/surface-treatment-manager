<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import router from './router'

const user = ref(null)

const setUser = (newUser) => {
  user.value = newUser
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const logout = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/logout`)
    user.value = null
    router.push('/')
  } catch (error) {
    console.error('Logout failed')
  }
}

const checkLoginStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/logged_in`)
    user.value = response.data.user || null
  } catch (error) {
    console.error('Failed to check login status')
  }
}

onMounted(() => {
  checkLoginStatus()
})
</script>

<template>
  <header>
    <nav class="navbar bg-body-tertiary border-bottom">
      <div class="container justify-content-center">
        <RouterLink to="/home" class="navbar-brand">Surface Treatment Manager</RouterLink>
      </div>
    </nav>
  </header>

  <!-- <RouterView v-slot="{ Component }">
    <component
      :is="Component"
      v-bind="{
        ...(Component?.emits?.includes?.('login-success') && { onLoginSuccess: setUser }),
        ...(Component?.emits?.includes?.('logout') && { onLogout: logout })
      }"
    />
  </RouterView> -->
  <RouterView @login-success="setUser" @logout="logout"/>
</template>
