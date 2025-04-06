<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const makers = ref([])
const currentPage = ref(Number(route.query.page) || 1)
const totalPages = ref(1)

const fetchMakerList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/makers?page=${currentPage.value}`)
    const data = response.data
    makers.value = data.makers
    currentPage.value = data.current_page
    totalPages.value = data.total_pages
  } catch (error) {
    console.error('Get maker list failed')
  }
}

const getPageLink = (page) => ({
  path: route.path,
  query: { page }
})

watch(() => route.query.page, (newPage) => {
  currentPage.value = Number(newPage) || 1
  fetchMakerList()
}, { immediate: true })

onMounted(() => {
  fetchMakerList()
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center mt-5 mb-5">メーカーリスト</h3>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>メーカー名 / 住所</h6>
          <h6>電話番号 / FAX番号</h6>
        </div>
      </div>

      <RouterLink v-for="maker in makers" v-bind:key="maker.id" class="list-group-item list-group-item-action" v-bind:to="`/makers/${maker.id}`">
        <div class="d-flex justify-content-between">
          <h6>{{ maker.name }}</h6>
          <small>{{ maker.phone_number }}</small>
        </div>
        <div class="d-flex justify-content-between">
          <small>{{ maker.address }}</small>
          <small>{{ maker.fax_number }}</small>
        </div>
      </RouterLink>
    </div>

    <ul v-if="totalPages > 0"  class="pagination justify-content-center mb-5">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <RouterLink class="page-link" v-if="currentPage > 1" v-bind:to="getPageLink(currentPage - 1)">前ページ</RouterLink>
        <span v-else class="page-link">前ページ</span>
      </li>

      <li v-for="page in totalPages" v-bind:key="page" class="page-item" v-bind:class="{ active: page === currentPage }">
        <RouterLink class="page-link" v-bind:to="getPageLink(page)">{{ page }}</RouterLink>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <RouterLink class="page-link" v-if="currentPage < totalPages" v-bind:to="getPageLink(currentPage + 1)">次ページ</RouterLink>
        <span v-else class="page-link">次ページ</span>
      </li>
    </ul>

    <div class="d-flex justify-content-evenly">
      <RouterLink to="#">メーカー情報の登録</RouterLink>
      <RouterLink to="/home">メインメニューへ</RouterLink>
    </div>
  </div>
</template>
