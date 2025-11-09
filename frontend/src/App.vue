<script setup>
import { ref } from 'vue'

const messageType = ref('')
const message = ref('')

const showMessage = (payload) => {
  messageType.value = payload.type
  message.value = payload.text
}

const handleMessageDelete = () => {
  messageType.value = ''
  message.value = ''
}
</script>

<template>
  <header>
    <nav class="navbar bg-body-tertiary border-bottom">
      <div class="container justify-content-center">
        <RouterLink to="/home" class="navbar-brand">
          Surface Treatment Manager
        </RouterLink>
      </div>
    </nav>
  </header>

  <div v-if="message" v-bind:class="`alert alert-${messageType} alert-dismissible fade show`">
    {{ message }}
    <button
      type="button"
      class="btn-close"
      aria-label="通知を閉じる"
      v-on:click="handleMessageDelete"
      data-bs-dismiss="alert"
    >
    </button>
  </div>

  <RouterView v-on:message="showMessage"/>
</template>
