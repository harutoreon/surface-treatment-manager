<script setup>
import { onMounted } from 'vue'
import { useCategories } from '@/composables/useCategories.js'

const emit = defineEmits(['message'])
const { route, router, category, errorMessage, fetchCategoryData, categoryUpdate, loggedIn } = useCategories(emit)

const cancel = () => {
  router.push(`/categories/${category.value.id}`)
}

onMounted(async () => {
  if (await loggedIn) {
    await fetchCategoryData(route.params.id)
  }
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      カテゴリー情報の編集
    </h3>

    <form @submit.prevent="categoryUpdate">
      <label class="form-label" for="category-item">
        カテゴリー名
      </label>
      <input
        id="category-item"
        v-model="category.item"
        class="form-control mb-4 shadow-sm"
        type="text"
        required
      />

      <label class="form-label" for="category-summary">
        概要
      </label>
      <textarea
        id="category-summary"
        v-model="category.summary"
        class="form-control mb-4 shadow-sm"
        required
      />

      <div class="d-grid gap-2 d-md-block">
        <button type="submit" class="btn btn-primary me-md-2 shadow">
          更新
        </button>
        <button
          v-if="category.id"
          type="button"
          class="btn btn-outline-secondary shadow-sm"
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
