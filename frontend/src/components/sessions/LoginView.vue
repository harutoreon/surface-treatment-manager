<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const emit = defineEmits(['login-success', 'message'])
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const router = useRouter()
const name = ref('')
const password = ref('')
const errorMessage = ref('')
const selectedUserType = ref('')

const changeToAdminUserData = () => {
  name.value = 'admin user'
  password.value = 'adminpassword'
}

const changeToGeneralUserData = () => {
  name.value = 'general user'
  password.value = 'generalpassword'
}

const handleLogin = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      name: name.value,
      password: password.value
    })
    localStorage.setItem('token', response.data.token)
    emit('message', { type: 'success', text: 'ログインしました。' })
    router.push('/home')
  } catch {
    errorMessage.value = 'ユーザー名またはパスワードが無効です'
  }
}
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      ログイン
    </h3>

    <div>ユーザーの選択</div>

    <ul class="list-group mb-4">
      <li class="list-group-item">
        <div class="form-check">
          <input
            v-model="selectedUserType"
            v-on:change="changeToGeneralUserData"
            class="form-check-input"
            type="radio"
            id="general-user"
            value="general">
          <label
            class="form-check-label"
            for="general-user"
          >
            一般ユーザー
          </label>
        </div>
        <small class="ms-4">
          表面処理情報の検索ができます。
        </small>
      </li>
      <li class="list-group-item">
        <div class="form-check">
          <input
            v-model="selectedUserType"
            v-on:change="changeToAdminUserData"
            class="form-check-input"
            type="radio"
            id="admin-user"
            value="admin">
          <label
            class="form-check-label"
            for="admin-user"
          >
            管理者ユーザー
          </label>
        </div>
        <small class="ms-4">
          表面処理情報やメーカー情報を含むリソースを管理します。
        </small>
      </li>
    </ul>

    <form v-on:submit.prevent="handleLogin">
      <label for="user-name">
        ユーザー名
      </label>
      <input
        v-model="name"
        class="form-control mb-4"
        type="text"
        id="user-name"
      >
      <label for="user-password">
        パスワード
      </label>
      <input
        v-model="password"
        class="form-control mb-5"
        type="password"
        id="user-password"
      >
      <button
        type="submit"
        class="form-control btn btn-primary"
      >
        ログイン
      </button>
    </form>

    <p
      v-if="errorMessage"
      class="alert alert-danger mt-4"
      role="alert"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
