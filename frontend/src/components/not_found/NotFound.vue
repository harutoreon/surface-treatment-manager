<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/home')
}
</script>

<template>
  <div class="container text-center w-50">
    <p class="fs-1 m-5">
      404
    </p>
    <p>お探しのページは見つかりませんでした。</p>
    <p>存在しない URL か、移動された可能性があります。</p>
    <button class="btn btn-outline-primary mt-5" @click="goHome">
      ホームに戻る
    </button>
  </div>
</template>
