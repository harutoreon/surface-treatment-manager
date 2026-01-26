<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const router = useRouter()
const emit = defineEmits(['message'])

const department = ref('')
const name = ref('')
const errorMessage = ref('')

const departmentRegistration = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/departments`, {
      department: {
        name: name.value,
      }
    })
    department.value = response.data
    emit('message', { type: 'success', text: '部署を1件登録しました。' })
    router.push(`/departments/${department.value.id}`)
  } catch {
    errorMessage.value = '入力に不備があります。'
  }
}

onMounted(() => {
  checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      部署情報の登録
    </h3>

    <form @submit.prevent="departmentRegistration">
      <label class="form-label" for="department-name">
        部署名
      </label>
      <input
        id="department-name"
        v-model="name"
        class="form-control mb-4"
        type="text"
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
        <RouterLink to="/departments" class="d-flex justify-content-evenly">
          部署リストへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
