<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { checkLoginStatus } from '../utils.js'

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
  await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
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

    <div class="d-flex justify-content-evenly">
      <RouterLink v-bind:to="`/users/${user.id}/edit`" ref="linkUsersEdit">
        ユーザー情報の編集
      </RouterLink>
      <RouterLink to="/users" ref="linkUsers">
        ユーザーリスト
      </RouterLink>
      <p v-on:click="handleDelete" class="text-primary text-decoration-underline">
        ユーザーの削除
      </p>
    </div>
  </div>
</template>

<style>
p {
  cursor: pointer;
}
</style>
