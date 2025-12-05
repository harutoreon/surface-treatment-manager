<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const user = ref([])
const route = useRoute()
const router = useRouter()

const fetchUserInformation = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`)
    user.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'ユーザー情報の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const handleDelete = async () => {
  const confirmDelete = window.confirm('本当に削除しますか？')
  if (!confirmDelete) return

  try {
    await axios.delete(`${API_BASE_URL}/users/${route.params.id}`)
    emit('message', { type: 'success', text: 'ユーザー情報を削除しました。' })
    router.push('/users')
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'ユーザー情報の削除に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchUserInformation(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      ユーザー情報
    </h3>

    <div class="list-group mb-5">
      <li class="d-flex justify-content-between list-group-item">
        <div>ユーザー名：</div>
        <div>{{ user.name }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>部署名：</div>
        <div>{{ user.department }}</div>
      </li>
    </div>

    <ul class="nav justify-content-evenly">
      <li class="nav-item">
        <RouterLink v-if="user.id" v-bind:to="`/users/${user.id}/edit`">
          ユーザー情報の編集
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/users">
          ユーザーリスト
        </RouterLink>
      </li>
    </ul>

    <div class="d-flex justify-content-end mt-5">
      <button
        v-on:click="handleDelete"
        class="btn btn-outline-danger"
        type="button"
      >
        ユーザーの削除
      </button>
    </div>
  </div>
</template>
