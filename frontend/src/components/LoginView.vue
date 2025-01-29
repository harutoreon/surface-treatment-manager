<script setup>
import { ref } from 'vue'
import axios from 'axios'

const name = ref('')
const password = ref('')
const errorMessage = ref('')

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const handleLogin = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      name: name.value,
      password: password.value
    })
    emit('login-success', response.data.user)
  } catch (error) {
    errorMessage.value = 'Invalid name or password'
  }
}
</script>

<template>
  <div>
    <form v-on:submit.prevent="handleLogin">
      <input v-model="name" type="text" placeholder="Name" required><br>
      <input v-model="password" type="password" placeholder="Password" required><br>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style>
.error {
  color: red;
}
</style>
