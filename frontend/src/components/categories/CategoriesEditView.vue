<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const emit = defineEmits(['message'])
const route = useRoute()
const router = useRouter()
const category = ref({ item: '', summary: '' })
const errorMessage = ref('')
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const fetchCategoryData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${id}`)
    category.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'カテゴリー情報の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const categoryUpdate = async () => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/categories/${category.value.id}`, {
      item: category.value.item,
      summary: category.value.summary
    })
    category.value = response.data
    emit('message', { type: 'success', text: 'カテゴリー情報を更新しました。' })
    router.push(`/categories/${category.value.id}`)
  } catch {
    errorMessage.value = '入力に不備があります。'
  }
}

const cancel = () => {
  router.push(`/categories/${category.value.id}`)
}

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchCategoryData(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      カテゴリー情報の編集
    </h3>

    <form @submit.prevent="categoryUpdate">
      <label class="form-label" for="category-item">
        カテゴリー名
      </label>
      <input
        id="category-item"
        v-model="category.item"
        class="form-control mb-4"
        type="text"
        required
      >

      <label class="form-label" for="category-summary">
        概要
      </label>
      <textarea
        id="category-summary"
        v-model="category.summary"
        class="form-control mb-4"
        required
      />

      <div class="d-grid gap-2 d-md-block">
        <button type="submit" class="btn btn-primary me-md-2">
          更新
        </button>
        <button
          v-if="category.id"
          type="button"
          class="btn btn-outline-secondary"
          @click="cancel"
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
