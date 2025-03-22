<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const categories = ref([])

function replaceStringWithEllipsis() {
  for (let i = 0; i < categories.value.length; i++) {
    if (categories.value[i].summary.length > 10) {
      categories.value[i].summary = categories.value[i].summary.slice(0, 10) + '...'  
    }
  }
}

const fetchCategoryList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`)
    categories.value = response.data
    replaceStringWithEllipsis()
  } catch (error) {
    console.error('Get category list failed')
  }
}

onMounted(() => {
  fetchCategoryList()
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">カテゴリーリスト</h3>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>カテゴリー名</h6>
          <h6>概要</h6>
        </div>
      </div>

      <RouterLink v-for="category in categories" v-bind:key="category.id" class="list-group-item list-group-item-action" v-bind:to="`/categories/${category.id}`">
        <div class="d-flex w-100 justify-content-between">
          <h6>{{ category.item }}</h6>
          <h6>{{ category.summary }}</h6>
        </div>        
      </RouterLink>
    </div>

    <div class="d-flex justify-content-evenly">
      <RouterLink to="#">カテゴリー情報の登録</RouterLink>
      <RouterLink to="/home">メインメニューへ</RouterLink>
    </div>
  </div>
</template>
