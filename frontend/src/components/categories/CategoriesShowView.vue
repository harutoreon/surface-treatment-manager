<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const emit = defineEmits(['message'])
const category = ref({ data: { item: '', summary: '' } })
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

onMounted(() => {
  fetchCategoryData(route.params.id)
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center mt-5 mb-5">
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

    <div class="d-flex justify-content-evenly">
      <RouterLink v-bind:to="`/categories/${category.id}/edit`" ref="linkCategoriesEdit">
        カテゴリー情報の編集
      </RouterLink>
      <p v-on:click="handleDelete" class="text-primary text-decoration-underline">
        カテゴリーの削除
      </p>
      <RouterLink to="/categories" ref="linkCategories">
        カテゴリーリストへ
      </RouterLink>
    </div>
  </div>
</template>

<style>
p {
  cursor: pointer;
}
</style>
