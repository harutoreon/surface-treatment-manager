<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const options = ref([])
const user = ref('')
const name = ref('')
const department = ref('')
const password = ref('')
const password_confirmation = ref('')
const errorMessage = ref('')

const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/departments`)
    options.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '部署名の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

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
  } catch {
    errorMessage.value = '入力に不備があります。'
  }
}

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchDepartments()
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      ユーザー情報の登録
    </h3>

    <form @submit.prevent="userRegistration">
      <label class="form-label" for="user-name">
        ユーザー名
      </label>
      <input
        id="user-name"
        v-model="name"
        class="form-control mb-3"
        type="text"
        required
      />

      <label class="form-label" for="user-department">
        部署名
      </label>
      <select
        id="user-department"
        v-model="department"
        class="form-select mb-3"
        required
      >
        <option value="">
          部署名を選択して下さい
        </option>
        <option v-for="option in options" :key="option.id" :value="option.name">
          {{ option.name }}
        </option>
      </select>

      <label class="form-label" for="user-password">
        パスワード
      </label>
      <input
        id="user-password"
        v-model="password"
        class="form-control mb-3"
        type="password"
        required
      />

      <label class="form-label" for="user-password-confirmation">
        パスワードの確認
      </label>
      <input
        id="user-password-confirmation"
        v-model="password_confirmation"
        class="form-control mb-4"
        type="password"
        required
      />

      <button type="submit" class="form-control btn btn-primary mb-5">
        登録
      </button>
    </form>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>
    
    <ul class="nav justify-content-center">
      <li class="nav-item">
        <RouterLink to="/users">
          ユーザーリスト
        </RouterLink>
      </li>
    </ul>
  </div>
</template>