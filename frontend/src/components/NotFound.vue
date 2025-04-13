<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/home')
}
</script>

<template>
  <div class="container text-center w-50">
    <h1 class="mt-5 mb-5">404</h1>
    <p>お探しのページは見つかりませんでした。</p>
    <p>存在しないURLか、移動された可能性があります。</p>
    <button class="btn btn-outline-primary mt-5" v-on:click="goHome">ホームに戻る</button>
  </div>
</template>
