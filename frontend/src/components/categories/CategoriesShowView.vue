<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const category = ref({})
const route = useRoute()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const fetchCategoryData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${id}`)
    category.value = response.data
  } catch (error) {
    console.error('Get category information failed')
  }
}

onMounted(() => {
  fetchCategoryData(route.params.id)
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center mt-5 mb-5">カテゴリー情報</h3>

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
      <div><a href="#">編集</a></div>
      <div><a href="#">削除</a></div>
      <div><a href="#">カテゴリーリストへ</a></div>
    </div>
  </div>
</template>
