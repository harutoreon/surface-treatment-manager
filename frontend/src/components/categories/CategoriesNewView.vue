<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.js'

const emit = defineEmits(['message'])
const router = useRouter()
const item = ref('')
const summary = ref('')
const category = ref('')
const errorMessage = ref('')
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const categoryRegistration = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/categories`, {
      category: {
        item: item.value,
        summary: summary.value
      }
    })
    category.value = response.data
    emit('message', { type: 'success', text: 'カテゴリーを1件登録しました。' })
    router.push(`/categories/${category.value.id}`)
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
    <h3 class="text-center mt-5 mb-5">
      カテゴリー情報の登録
    </h3>

    <form v-on:submit.prevent="categoryRegistration">
      <label class="form-label" for="category-item">
        カテゴリー名
      </label>
      <input
        v-model="item"
        class="form-control mb-4"
        type="text"
        id="category-item"
        required
      />

      <label class="form-label" for="category-summary">
        概要
      </label>
      <textarea
        v-model="summary"
        class="form-control mb-4"
        id="category-summary"
        required
      >
      </textarea>
      
      <button type="submit" class="form-control btn btn-primary mb-5">
        登録
      </button>
    </form>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <RouterLink to="/categories" class="d-flex justify-content-evenly" ref="linkCategories">
      カテゴリーリストへ
    </RouterLink>
  </div>
</template>
