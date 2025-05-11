<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import router from './router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const user = ref(null)
const messageType = ref('')
const message = ref('')

const setUser = (newUser) => {
  user.value = newUser
}

const handleMessageDelete = () => {
  messageType.value = ''
  message.value = ''
}

const logout = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/logout`)
    user.value = null
    router.push('/')
  } catch (error) {
    messageType.value = 'danger'
    message.value = 'ログアウト処理に失敗しました。'
  }
}

const checkLoginStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/logged_in`)
    user.value = response.data.user || null
  } catch (error) {
    message.value = 'danger'
    message.value = 'ログイン情報の取得に失敗しました。'
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
  
  <div v-if="message" v-bind:class="`alert alert-${messageType} alert-dismissible fade show`">
    {{ message }}
    <button type="button" class="btn-close" v-on:click="handleMessageDelete" data-bs-dismiss="alert"></button>
  </div>

  <RouterView @login-success="setUser" @logout="logout"/>
</template>
