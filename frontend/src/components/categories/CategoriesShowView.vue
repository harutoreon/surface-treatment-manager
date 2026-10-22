<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoriesShow } from '@/composables/categories/useCategoriesShow'
import { useCategorySamples } from '@/composables/categories/useCategorySamples'
import { useAuthGuard } from '@/composables/auth/useAuthGuard'
import type { MessageEmit } from '@/env'
import CategoriesDestroyView from '@/components/categories/CategoriesDestroyView.vue'
import { useRoute } from 'vue-router'

const emit = defineEmits<MessageEmit>()
const route = useRoute()
const { requireLogin } = useAuthGuard(emit)
const { category, fetchCategoryData } = useCategoriesShow(emit)
const { categorySamples, fetchCategorySamples } = useCategorySamples(emit)

onMounted(async () => {
  const loggedIn = await requireLogin()
  if (loggedIn) {
    await fetchCategoryData(route.params.id as string)
    await fetchCategorySamples(route.params.id as string)
  }
})
</script>

<template>
  <div v-if="category" class="container w-50">
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
        <div id="category-samples">
          {{ categorySamples.length }}
        </div>
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

    <CategoriesDestroyView @message="emit('message', $event)" />
  </div>
</template>
