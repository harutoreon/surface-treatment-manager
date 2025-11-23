<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const route = useRoute()
const router = useRouter()
const department = ref('')
const errorMessage = ref('')

const fetchDepartmentData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/departments/${id}`)
    department.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '部署情報の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const departmentUpdate = async () => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/departments/${department.value.id}`, {
      name: department.value.name,
    })
    department.value = response.data
    emit('message', { type: 'success', text: '部署情報を更新しました。' })
    router.push(`/departments/${department.value.id}`)
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
  await fetchDepartmentData(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      部署情報の編集
    </h3>

    <form v-on:submit.prevent="departmentUpdate">
      <label class="form-label" for="department-name">
        部署名
      </label>
      <input
        v-model="department.name"
        class="form-control mb-4"
        type="text"
        id="department-name"
      >

      <div class="d-grid gap-2 d-md-block">
        <button type="submit" class="btn btn-primary me-md-2">
          更新
        </button>
        <button
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
