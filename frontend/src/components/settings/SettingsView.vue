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
    <p class="fs-3 text-center m-5">
      アプリケーションの管理
    </p>

    <div class="list-group list-group-flush border-top border-bottom mb-5">
      <button class="list-group-item list-group-item-action pt-4 pb-4" @click="handleLogout">
        <div class="fw-bold text-primary mb-1">
          ログアウト
        </div>
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
