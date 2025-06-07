<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/home')
}
</script>

<template>
  <div class="container text-center w-50">
    <h1 class="mt-5 mb-5">404</h1>

    <p id="page-not-found">お探しのページは見つかりませんでした。</p>
    <p id="url-missing-reason">存在しない URL か、移動された可能性があります。</p>
    
    <button
      class="btn btn-outline-primary mt-5"
      v-on:click="goHome"
    >
      ホームに戻る
    </button>
  </div>
</template>
