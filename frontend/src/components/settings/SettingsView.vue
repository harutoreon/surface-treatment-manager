<script setup>
const emit = defineEmits(['logout'])

const handleLogout = () => {
  if (confirm('本当にログアウトしますか？')) {
    emit('logout')
  }  
}
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      アプリケーションの管理
    </h3>

    <div class="list-group list-group-flush border-top border-bottom mb-5">
      <button v-on:click="handleLogout" class="list-group-item list-group-item-action pt-4 pb-4">
        <h6 class="fw-bold text-primary">
          ログアウト
        </h6>
        <small>アプリケーションからログアウトします。</small>
      </button>
    </div>

    <div class="d-flex justify-content-center">
      <RouterLink to="/home" class="me-5">
        メインメニューへ
      </RouterLink>
    </div>
  </div>
</template>
