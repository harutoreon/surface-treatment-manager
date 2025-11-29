<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const route = useRoute()
const router = useRouter()
const user = ref({
  name: '',
  department: ''
})
const password = ref('')
const password_confirmation = ref('')
const errorMessage = ref('')

const userUpdate = async () => {
  try {
    // パスワードの変更がない場合に空の値が送信されないよう、パスワード入力はオプションとする。
    const updateData = {
      user: {
        name: user.value.name,
        department: user.value.department,
      }
    }

    if (password.value) {
      updateData.user.password = password.value
      updateData.user.password_confirmation = password_confirmation.value  
    }

    const response = await axios.patch(`${API_BASE_URL}/users/${user.value.id}`, updateData)
    user.value = response.data
    emit('message', { type: 'success', text: 'ユーザー情報を更新しました。' })
    router.push(`/users/${user.value.id}`)
  } catch {
    errorMessage.value = '入力に不備があります。'
  }
}

const fetchUserInformation = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${route.params.id}`)
    user.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'ユーザー情報の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const cancel = () => {
  router.push(`/users/${user.value.id}`)
}

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchUserInformation()
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      ユーザー情報の編集
    </h3>

    <form v-on:submit.prevent="userUpdate">
      <label class="form-label" for="user-name">
        ユーザー名
      </label>
      <input
        class="form-control mb-3"
        type="text"
        v-model="user.name"
        id="user-name"
        required
      >

      <label class="form-label" for="user-department">
        部署名
      </label>
      <input
        class="form-control mb-3"
        type="text"
        v-model="user.department"
        id="user-department"
        required
      >

      <label class="form-label" for="user-password">
        パスワード
      </label>
      <input
        class="form-control mb-3"
        type="password"
        v-model="password"
        id="user-password"
      >

      <label class="form-label" for="user-password-confirmation">
        パスワードの確認
      </label>
      <input
        class="form-control mb-4"
        type="password"
        v-model="password_confirmation"
        id="user-password-confirmation"
      >

      <div class="d-grid gap-2 d-md-block">
        <button type="submit" class="btn btn-primary me-md-2">
          更新
        </button>
        <button
          v-if="user.id"
          v-on:click="cancel"
          type="button"
          class="btn btn-outline-secondary"
        >
          キャンセル
        </button>
      </div>
    </form>
    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>