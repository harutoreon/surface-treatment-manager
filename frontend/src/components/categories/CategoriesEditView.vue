<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '../utils.js'

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

onMounted(async () => {
  await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  await fetchCategoryData(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      カテゴリー情報の編集
    </h3>

    <form v-on:submit.prevent="categoryUpdate">
      <label class="form-label" for="category-item">
        カテゴリー名
      </label>
      <input
        v-model="category.item"
        class="form-control mb-4"
        type="text"
        id="category-item"
        required
      >

      <label class="form-label" for="category-summary">
        概要
      </label>
      <textarea
        v-model="category.summary"
        class="form-control mb-4"
        id="category-summary"
        required
      >
      </textarea>
      
      <button type="submit" class="form-control btn btn-primary mb-5">
        更新
      </button>
    </form>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <div class="d-flex justify-content-evenly">
      <RouterLink v-bind:to="`/categories/${category.id}`" ref="linkCategoriesShow">
        カテゴリー情報へ
      </RouterLink>
      <RouterLink to="/categories" ref="linkCategories">
        カテゴリーリストへ
      </RouterLink>
    </div>
  </div>
</template>
