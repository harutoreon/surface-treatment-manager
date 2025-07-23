<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()

const handleLogout = async () => {
  const confirmDelete = window.confirm('本当にログアウトしますか？')
  if (!confirmDelete) return

  try {
    await axios.delete(`${API_BASE_URL}/logout`)
    router.push('/')
  } catch (error){
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'ログアウト処理に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
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
