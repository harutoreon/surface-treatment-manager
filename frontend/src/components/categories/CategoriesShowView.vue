<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '../utils.js'

const emit = defineEmits(['message'])
const category = ref('')
const route = useRoute()
const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const fetchCategoryData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${id}`)
    category.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'カテゴリーの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const handleDelete = async () => {
  const confirmDelete = window.confirm('本当に削除しますか？')
  if (!confirmDelete) return

  try {
    await axios.delete(`${API_BASE_URL}/categories/${route.params.id}`)
    emit('message', { type: 'success', text: 'カテゴリーを1件削除しました。' })
    router.push('/categories')
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '削除処理に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
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
  <div class="container w-50">
    <h3 class="text-center m-5">
      カテゴリー情報
    </h3>

    <ul class="list-group mb-5">
      <li class="d-flex justify-content-between list-group-item">
        <div>カテゴリー名 :</div>
        <div>{{ category.item }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>概要 :</div>
        <div>{{ category.summary }}</div>
      </li>
    </ul>

    <ul class="nav justify-content-evenly">
      <li class="nav-item">
        <RouterLink v-if="category.id" :to="`/categories/${category.id}/edit`">
          カテゴリー情報の編集
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/categories">
          カテゴリーリストへ
        </RouterLink>
      </li>
    </ul>

    <div class="d-flex justify-content-end mt-5">
      <button
        class="btn btn-outline-danger"
        type="button"
        @click="handleDelete"
      >
        カテゴリー情報の削除
      </button>
    </div>
  </div>
</template>
