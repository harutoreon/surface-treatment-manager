<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import router from '@/router'

  const item = ref('')
  const summary = ref('')
  const category = ref('')
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
      console.log(category.value)
      router.push(`/categories/${category.value.id}`)
    } catch (error) {
      console.error('Category registration failed.')
    }
  }

</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">カテゴリー情報の登録</h3>

    <form v-on:submit.prevent="categoryRegistration">
      <label class="form-label" for="category_item">カテゴリー名</label>
      <input v-model="item" class="form-control mb-4" type="text" id="category_item" required/>

      <label class="form-label" for="category_summary">概要</label>
      <input v-model="summary" class="form-control mb-4" type="text" id="category_summary" required/>

      <input type="submit" name="commit" value="登録" class="form-control btn btn-primary mb-5" data-disable-with="登録" />
    </form>

    <div class="d-flex justify-content-evenly">
      <RouterLink to="/categories">カテゴリーリストへ</RouterLink>
    </div>
  </div>
</template>
