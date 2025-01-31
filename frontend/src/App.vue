<script setup>
import { ref } from 'vue'
import axios from 'axios'
import LoginView from './components/LoginView.vue';

const user = ref(null)

const setUser = (newUser) => {
  user.value = newUser
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const logout = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/logout`)
    user.value = null
  } catch (error) {
    console.error('Logout failed')
  }
}
</script>

<template>
  <div>
    <header>
      <h1>Welcome {{ user ? user.name : 'Guest' }}</h1>
      <button v-if="user" v-on:click="logout">Logout</button>
    </header>
    <main>
      <LoginView v-if="!user" @login-success="setUser"/>
    </main>
  </div>
</template>
