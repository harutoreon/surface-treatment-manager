<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const emit = defineEmits(['message'])
const router = useRouter()
const name = ref('')
const department = ref('')
const password = ref('')
const password_confirmation = ref('')
const errorMessage = ref('')

const options = ref([
  { text: '品質管理部', value: '品質管理部' },
  { text: '製造部', value: '製造部' },
  { text: '開発部', value: '開発部' },
  { text: '営業部', value: '営業部' },
])

const user = ref('')
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const userRegistration = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, {
      user: {
        name: name.value,
        department: department.value,
        password: password.value,
        password_confirmation: password_confirmation.value
      }
    })
    user.value = response.data
    emit('message', { type: 'success', text: 'ユーザー情報を登録しました。' })
    router.push(`/users/${user.value.id}`)
  } catch (error) {
    errorMessage.value = '入力に不備があります。'
  }
}
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">ユーザー情報の登録</h3>

    <form v-on:submit.prevent="userRegistration">
      <label class="form-label" for="user_name">ユーザー名</label>
      <input v-model="name" class="form-control mb-3" type="text" id="user_name" required>

      <label class="form-label" for="user_department">部署名</label>
      <select v-model="department" class="form-select mb-3" id="user_department" required>
        <option value="" label=" "></option>
        <option v-for="option in options" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>

      <label class="form-label" for="user_password">パスワード</label>
      <input v-model="password" class="form-control mb-3" type="password" id="user_password" required>

      <label class="form-label" for="user_password_confirmation">パスワードの確認</label>
      <input v-model="password_confirmation" class="form-control mb-4" type="password" id="user_password_confirmation" required>

      <button type="submit" class="form-control btn btn-primary mb-5">登録</button>
    </form>
    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">{{ errorMessage }}</p>
    
    <RouterLink to="/users" class="d-flex justify-content-evenly">ユーザーリスト</RouterLink>
  </div>
</template>