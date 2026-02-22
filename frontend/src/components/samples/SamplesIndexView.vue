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
    <h3 class="m-5">
      表面処理リスト
    </h3>

    <div class="list-group list-group-flush mb-2">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <span class="mb-1">処理名 / 色</span>
          <span class="mb-1">主な機能</span>
        </div>
      </div>

      <RouterLink
        v-for="sample in samples"
        :key="sample.id"
        class="list-group-item list-group-item-action"
        :to="`/samples/${sample.id}`"
      >
        <div class="d-flex w-100 justify-content-between">
          <div :id="`sample-name-${sample.id}`" class="mb-1">
            {{ sample.name }}
          </div>
          <div :id="`sample-feature-${sample.id}`" class="mb-1">
            {{ sample.feature }}
          </div>
        </div>
        <div class="d-flex w-100 justify-content-between">
          <div :id="`sample-color-${sample.id}`">
            {{ sample.color }}
          </div>
        </div>
      </RouterLink>
    </div>

    <ul v-if="totalPages > 0" id="pagination" class="pagination justify-content-center mb-5">
      <li id="pagination_previous_page" class="page-item" :class="{ disabled: currentPage === 1 }">
        <RouterLink v-if="currentPage > 1" class="page-link" :to="getPageLink(currentPage - 1)">
          前ページ
        </RouterLink>
        <span v-else class="page-link">
          前ページ
        </span>
      </li>

      <li
        v-for="page in totalPages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <RouterLink class="page-link" :to="getPageLink(page)">
          {{ page }}
        </RouterLink>
      </li>

      <li id="pagination_next_page" class="page-item" :class="{ disabled: currentPage === totalPages }">
        <RouterLink v-if="currentPage < totalPages" class="page-link" :to="getPageLink(currentPage + 1)">
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
