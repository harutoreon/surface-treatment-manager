<script setup>
import { onMounted } from 'vue'
import { useStaticPagesCategory} from '@/composables/useStaticPagesCategory.js'

const emit = defineEmits(['message'])

const {
  errorMessage,
  keyword,
  options,
  fetchCategories,
  submitSearch,
  loggedIn
} = useStaticPagesCategory(emit)

onMounted(async () => {
  if (await loggedIn) {
    await fetchCategories()
  }
})
</script>

<template>
  <div class="container text-center w-25">
    <h3 class="m-5">
      カテゴリーで検索
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <form @submit.prevent="submitSearch">
      <select v-model="keyword" class="form-select mb-3 shadow-sm">
        <option value="">
          カテゴリーを選択して下さい
        </option>
        <option v-for="option in options" :key="option.id" :value="option.item">
          {{ option.item }}
        </option>
      </select>
      <button type="submit" class="btn btn-secondary form-control mb-5 shadow">
        検索
      </button>
    </form>

    <ul class="nav justify-content-center">
      <li class="nav-item">
        <RouterLink to="/home">
          メインメニューへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

