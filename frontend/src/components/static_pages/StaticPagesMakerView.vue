<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const keyword = ref('')
const router = useRouter()
const errorMessage = ref('')

const submitSearch = () => {
  if (!keyword.value) {
    errorMessage.value = 'キーワードが未入力です'
    return
  }
  router.push({
    name: 'SearchResults',
    params: { searchMethod: 'maker' },
    query: { keyword: keyword.value }
  })
}
</script>

<template>
  <div class="container text-center w-25">
    <h3 class="mt-5 mb-5">
      メーカー名で検索
    </h3>
    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>
    <form v-on:submit.prevent="submitSearch">
      <input
        v-model="keyword"
        type="text"
        class="form-control mb-3"
        placeholder="キーワードをここに入力"
      />
      <button type="submit" class="btn btn-secondary form-control mb-5">
        検索
      </button>
    </form>
    <div>
      <RouterLink to="/home" ref="linkHome">
        メインメニューへ
      </RouterLink>
    </div>
  </div>
</template>
