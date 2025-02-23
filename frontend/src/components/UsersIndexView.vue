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

      <a v-for="user in users" v-bind:key="user.id" class="list-group-item list-group-item-action" href="#">
        <div class="d-flex justify-content-between">
          <div>{{ user.name }}</div>
          <div>{{ user.department }}</div>
        </div>
      </a>
    </div>

      <ul class="pagination justify-content-center mb-5">
        <li class="page-item disabled">
          <a class="page-link">前ページ</a>
        </li>
        <li class="page-item active">
          <a class="page-link" href="#">1</a>
        </li>
        <li class="page-item ">
          <a class="page-link" href="#">2</a>
        </li>
        <li class="page-item ">
          <a class="page-link" href="#">3</a>
        </li>
        <li class="page-item ">
          <a class="page-link" href="#">4</a>
        </li>
        <li class="page-item ">
          <a class="page-link" href="#">5</a>
        </li>
        <li class="page-item ">
          <a class="page-link" href="#">6</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">次ページ</a>
        </li>
      </ul>

    <div class="d-flex justify-content-evenly">
      <a href="#">ユーザー情報の登録</a>
      <a href="#">メインメニューへ</a>
    </div>
  </div>
</template>