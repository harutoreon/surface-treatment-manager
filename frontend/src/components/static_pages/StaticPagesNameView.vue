<script setup>
import { useStaticPagesName } from '@/composables/useStaticPagesName.js'

const { errorMessage, keyword, submitSearch } = useStaticPagesName()
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
      <input
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
