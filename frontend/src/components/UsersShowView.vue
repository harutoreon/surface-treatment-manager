<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const user = ref([])
const route = useRoute()

const fetchUserInformation = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`)
    user.value = response.data
  } catch (error) {
    console.error('Get user information failed')
  }
}

onMounted(() => {
  fetchUserInformation(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">ユーザー情報</h3>

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
      <RouterLink to="#">ユーザー情報の編集</RouterLink>
      <RouterLink to="/users">ユーザーリスト</RouterLink>
    </div>
  </div>
</template>