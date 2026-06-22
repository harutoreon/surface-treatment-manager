<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategories } from '@/composables/useCategories.js'
import { useCategorySamples } from '@/composables/category/useCategorySamples.ts'

const emit = defineEmits(['message'])
const { route, category, fetchCategoryData, handleDelete, loggedIn } = useCategories(emit)

const { categorySamples, fetchCategorySamples } = useCategorySamples(emit)

onMounted(async () => {
  if (await loggedIn) {
    await fetchCategoryData(route.params.id)
    await fetchCategorySamples(category.value.id)
  }
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      カテゴリー情報
    </h3>

    <ul class="list-group mb-5 shadow-sm">
      <li class="d-flex justify-content-between list-group-item">
        <div>カテゴリー名 :</div>
        <div>{{ category.item }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>概要 :</div>
        <div>{{ category.summary }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>サンプル件数 :</div>
        <div>{{ categorySamples.length }}</div>
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
        class="btn btn-outline-danger shadow-sm"
        type="button"
        @click="handleDelete"
      >
        カテゴリー情報の削除
      </button>
    </div>
  </div>
</template>
