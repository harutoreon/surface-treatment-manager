<script setup>
import { onMounted } from 'vue'
import { useCategories } from '@/composables/useCategories.js'

const emit = defineEmits(['message'])
const { categories, fetchCategoryList, loggedIn } = useCategories(emit)

onMounted(async () => {
  if (await loggedIn) {
    await fetchCategoryList()
  }
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      カテゴリーリスト
    </h3>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <div>カテゴリー名</div>
          <div>概要</div>
        </div>
      </div>

      <RouterLink
        v-for="category in categories"
        :key="category.id"
        class="list-group-item list-group-item-action"
        :to="`/categories/${category.id}`"
      >
        <div class="d-flex w-100 justify-content-between">
          <div>{{ category.item }}</div>
          <div>{{ category.summary }}</div>
        </div>        
      </RouterLink>
    </div>

    <ul class="nav justify-content-evenly">
      <li class="nav-item">
        <RouterLink to="/categories/new">
          カテゴリー情報の登録
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/home">
          メインメニューへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
