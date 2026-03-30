<script setup>
import { useNavigation} from '@/composables/useNavigation.js'

const { goHome } = useNavigation()
</script>

<template>
  <div class="container text-center w-50">
    <h1 class="m-5">
      404
    </h1>
    <p>お探しのページは見つかりませんでした。</p>
    <p>存在しない URL か、移動された可能性があります。</p>
    <button class="btn btn-outline-primary mt-5 shadow-sm" @click="goHome">
      ホームに戻る
    </button>
  </div>
</template>
