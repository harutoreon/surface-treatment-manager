<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const category = ref({ item: '', summary: '' })
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const fetchCategoryData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${id}`)
    category.value = response.data
  } catch (error) {
    console.error('Get category data failed')
  }
}

onMounted(() => {
  fetchCategoryData(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">カテゴリー情報の編集</h3>

    <!-- <form v-on:submit.prevent="categoryRegistration"> -->
    <form>
      <label class="form-label" for="category_item">カテゴリー名</label>
      <input v-model="category.item" class="form-control mb-4" type="text" id="category_item" required/>

      <label class="form-label" for="category_summary">概要</label>
      <textarea v-model="category.summary" class="form-control mb-4" id="category_summary" required></textarea>
      
      <button type="submit" class="form-control btn btn-primary mb-5">登録</button>
    </form>

    <!-- <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">{{ errorMessage }}</p> -->

    <div class="d-flex justify-content-evenly">
      <RouterLink v-bind:to="`/categories/${category.id}`">カテゴリー情報へ</RouterLink>
      <RouterLink to="/categories">カテゴリーリストへ</RouterLink>
    </div>
  </div>  
</template>
