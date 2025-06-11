<script setup>
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['message'])
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const users = ref([])
const currentPage = ref(Number(route.query.page) || 1)
const totalPages = ref(1)

const fetchUserList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users?page=${currentPage.value}`)
    const data = response.data
    users.value = data.users
    currentPage.value = data.current_page
    totalPages.value = data.total_pages
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'ユーザーリストの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const getPageLink = (page) => ({
  path: route.path,
  query: { page }
})

watch(() => route.query.page, (newPage) => {
  currentPage.value = Number(newPage) || 1
  fetchUserList()
}, { immediate: true })

onMounted(() => {
  fetchUserList()
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      ユーザーリスト
    </h3>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item">
        <div class="d-flex justify-content-between">
          <small>ユーザー名</small>
          <small>部署名</small>
        </div>        
      </div>

      <RouterLink v-for="user in users" v-bind:key="user.id" class="list-group-item list-group-item-action" v-bind:to="`/users/${user.id}`">
        <div class="d-flex justify-content-between">
          <div>{{ user.name }}</div>
          <div>{{ user.department }}</div>
        </div>
      </RouterLink>
    </div>

    <ul v-if="totalPages > 0"  class="pagination justify-content-center mb-5">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <RouterLink class="page-link" v-if="currentPage > 1" v-bind:to="getPageLink(currentPage - 1)">
          前ページ
        </RouterLink>
        <span v-else class="page-link">
          前ページ
        </span>
      </li>

      <li v-for="page in totalPages" v-bind:key="page" class="page-item" v-bind:class="{ active: page === currentPage }">
        <RouterLink class="page-link" v-bind:to="getPageLink(page)">
          {{ page }}
        </RouterLink>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <RouterLink class="page-link" v-if="currentPage < totalPages" v-bind:to="getPageLink(currentPage + 1)">
          次ページ
        </RouterLink>
        <span v-else class="page-link">
          次ページ
        </span>
      </li>
    </ul>

    <div class="d-flex justify-content-evenly">
      <RouterLink to="/users/new" ref="linkUsersNew">
        ユーザー情報の登録
      </RouterLink>
      <RouterLink to="/home" ref="linkHome">
        メインメニューへ
      </RouterLink>
    </div>
  </div>
</template>