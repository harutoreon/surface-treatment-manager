<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = async () => {
  const confirmDelete = window.confirm('本当にログアウトしますか？')
  if (!confirmDelete) return

  localStorage.removeItem('token')
  router.push('/')
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

    <ul class="nav justify-content-center">
      <li class="nav-item">
        <RouterLink to="/home">
          メインメニューへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
