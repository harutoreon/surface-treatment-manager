<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const router = useRouter()
const samples = ref('')
const currentPage = ref(Number(route.query.page) || 1)
const totalPages = ref(1)
const emit = defineEmits(['message'])

const fetchSampleList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sample_list_with_pagination?page=${currentPage.value}`)
    samples.value = response.data.samples
    currentPage.value = response.data.current_page
    totalPages.value = response.data.total_pages
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '表面処理リストの取得に失敗しました。' })
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
  fetchSampleList()
})

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchSampleList()
})
</script>


<template>
  <div class="container text-center w-50">
    <h3 class="mt-5 mb-5">
      表面処理リスト
    </h3>

    <div class="list-group list-group-flush mb-2">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>処理名 / カテゴリー</h6>
          <h6>主な機能 / 色</h6>
        </div>
      </div>

      <RouterLink
        v-for="sample in samples"
        v-bind:key="sample.id"
        class="list-group-item list-group-item-action"
        v-bind:to="`/samples/${sample.id}`"
      >
        <div class="d-flex w-100 justify-content-between">
          <h6>{{ sample.name }}</h6>
          <h6>{{ sample.feature }}</h6>
        </div>
        <div class="d-flex w-100 justify-content-between">
          <h6>{{ sample.category }}</h6>
          <h6>{{ sample.color }}</h6>
        </div>
      </RouterLink>
    </div>

    <ul v-if="totalPages > 0"  class="pagination justify-content-center mb-5" id="pagination">
      <li class="page-item" :class="{ disabled: currentPage === 1 }" id="pagination_previous_page">
        <RouterLink class="page-link" v-if="currentPage > 1" v-bind:to="getPageLink(currentPage - 1)">
          前ページ
        </RouterLink>
        <span v-else class="page-link">
          前ページ
        </span>
      </li>

      <li
        v-for="page in totalPages"
        v-bind:key="page"
        class="page-item"
        v-bind:class="{ active: page === currentPage }"
      >
        <RouterLink class="page-link" v-bind:to="getPageLink(page)">
          {{ page }}
        </RouterLink>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }" id="pagination_next_page">
        <RouterLink class="page-link" v-if="currentPage < totalPages" v-bind:to="getPageLink(currentPage + 1)">
          次ページ
        </RouterLink>
        <span v-else class="page-link">
          次ページ
        </span>
      </li>
    </ul>

    <ul class="nav justify-content-evenly">
      <li class="nav-item">
        <RouterLink to="/samples/new">
          表面処理情報の登録
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/home">
          メインメニューへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
