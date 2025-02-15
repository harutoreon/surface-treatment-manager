<script setup>
import { ref } from 'vue'
import axios from 'axios'
import router from '../../router'

const name = ref('')
const password = ref('')
const errorMessage = ref('')
const emit = defineEmits(['login-success'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const handleLogin = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      name: name.value,
      password: password.value
    })
    emit('login-success', response.data.user)
    router.push('/settings')
  } catch (error) {
    errorMessage.value = 'ユーザー名またはパスワードが無効です'
  }
}
</script>

<template>
  <div class="container w-25">

    <h3 class="text-center mt-5 mb-5">ログイン</h3>

    <label>ユーザーの選択</label>

    <ul class="list-group mb-4">
      <li class="list-group-item">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="select_user" id="general_user" value="general_user">
          <label class="form-check-label" for="general_user">一般ユーザー</label>
        </div>
        <small class="ms-4">一部の機能は制限されます。</small>
      </li>
      <li class="list-group-item">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="select_user" id="admin_user" value="admin_user">
          <label class="form-check-label" for="admin_user">管理者ユーザー</label>
        </div>
        <small class="ms-4">すべての機能が利用できます。</small>
      </li>
    </ul>

    <form v-on:submit.prevent="handleLogin">
      <label for="name">ユーザー名</label>
      <input v-model="name" class="form-control" type="text" required><br>

      <label for="password">パスワード</label>
      <input v-model="password" class="form-control mb-4" type="password" required><br>

      <button type="submit" class="form-control btn btn-primary">ログイン</button>
    </form>
    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">{{ errorMessage }}</p>
  </div>
</template>
