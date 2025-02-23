<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const users = ref([])

const getUserList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`)
    users.value = response.data
  } catch (error) {
    console.error('Get user list failed')
  }
}

onMounted(() => {
  getUserList()
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">ユーザーリスト</h3>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item">
        <div class="d-flex justify-content-between">
          <small>ユーザー名</small>
          <small>部署名</small>
        </div>        
      </div>

      <RouterLink v-for="user in users" v-bind:key="user.id" class="list-group-item list-group-item-action" to="#">
        <div class="d-flex justify-content-between">
          <div>{{ user.name }}</div>
          <div>{{ user.department }}</div>
        </div>
      </RouterLink>
    </div>

      <ul class="pagination justify-content-center mb-5">
        <li class="page-item disabled">
          <RouterLink to="#" class="page-link">前ページ</RouterLink>
        </li>
        <li class="page-item active">
          <RouterLink to="#" class="page-link">1</RouterLink>
        </li>
        <li class="page-item ">
          <RouterLink to="#" class="page-link">2</RouterLink>
        </li>
        <li class="page-item ">
          <RouterLink to="#" class="page-link">3</RouterLink>
        </li>
        <li class="page-item ">
          <RouterLink to="#" class="page-link">4</RouterLink>
        </li>
        <li class="page-item ">
          <RouterLink to="#" class="page-link">5</RouterLink>
        </li>
        <li class="page-item ">
          <RouterLink to="#" class="page-link">6</RouterLink>
        </li>
        <li class="page-item">
          <RouterLink to="#" class="page-link">次ページ</RouterLink>
        </li>
      </ul>

    <div class="d-flex justify-content-evenly">
      <RouterLink to="#">ユーザー情報の登録</RouterLink>
      <RouterLink to="/home">メインメニューへ</RouterLink>
    </div>
  </div>
</template>