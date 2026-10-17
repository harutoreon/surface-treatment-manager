<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoriesNew } from '@/composables/categories/useCategoriesNew'
import { useAuthGuard } from '@/composables/auth/useAuthGuard'
import type { MessageEmit } from '@/env'

const emit = defineEmits<MessageEmit>()
const { requireLogin } = useAuthGuard(emit)
const { item, summary, errorMessage, categoryRegistration } = useCategoriesNew(emit)

onMounted(async () => {
  await requireLogin()
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      カテゴリー情報の登録
    </h3>

    <form @submit.prevent="categoryRegistration">
      <label class="form-label" for="category-item">
        カテゴリー名
      </label>
      <input
        id="category-item"
        v-model="item"
        class="form-control mb-4 shadow-sm"
        type="text"
        required
      />

      <label class="form-label" for="category-summary">
        概要
      </label>
      <textarea
        id="category-summary"
        v-model="summary"
        class="form-control mb-4 shadow-sm"
        required
      />
      
      <button type="submit" class="form-control btn btn-primary mb-5 shadow">
        登録
      </button>
    </form>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <ul class="nav justify-content-center">
      <li class="nav-item">
        <RouterLink to="/categories">
          カテゴリーリストへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
