<script setup>
import { ref } from 'vue'
import LoginView from './components/LoginView.vue';

const user = ref(null)

const setUser = (newUser) => {
  user.value = newUser
}
</script>

<template>
  <div>
    <header>
      <h1>Welcome {{ user ? user.name : 'Guest' }}</h1>
    </header>
    <main>
      <LoginView v-if="!user" @login-success="setUser"/>
    </main>
  </div>
</template>
