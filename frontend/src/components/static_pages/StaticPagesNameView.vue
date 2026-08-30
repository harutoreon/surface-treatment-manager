<script setup lang="ts">
import { onMounted } from 'vue'
import { useStaticPagesName } from '@/composables/static_pages/useStaticPagesName'
import { useAuthGuard } from '@/composables/auth/useAuthGuard'
import type { Emit } from '@/composables/auth/useAuthGuard'

const emit = defineEmits<Emit>()
const { errorMessage, keyword, submitSearch } = useStaticPagesName()
const { requireLogin } = useAuthGuard(emit)

onMounted(async () => {
  await requireLogin()
})
</script>

<template>
  <div class="container text-center w-25">
    <h3 class="m-5">
      処理名で検索
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <form @submit.prevent="submitSearch">
      <label for="keyword" class="form-label d-flex justify-content-start ms-1">
        検索キーワード
      </label>
      <input
        id="keyword"
        v-model="keyword"
        type="text"
        class="form-control mb-3 shadow-sm"
        placeholder="キーワードをここに入力"
      />
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
