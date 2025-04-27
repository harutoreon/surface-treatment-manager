<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const samples = ref('')
const currentPage = ref(Number(route.query.page) || 1)
const totalPages = ref(1)

const fetchSampleList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/samples?page=${currentPage.value}`)
    samples.value = response.data.samples
    currentPage.value = response.data.current_page
    totalPages.value = response.data.total_pages
  } catch (error) {
    console.error('Get sample list failed')
  }
}

const getPageLink = (page) => ({
  path: route.path,
  query: { page }
})

watch(() => route.query.page, (newPage) => {
  currentPage.value = Number(newPage) || 1
  fetchSampleList()
}, { immediate: true })

onMounted(() => {
  fetchSampleList()
})
</script>


<template>
  <div class="container text-center w-25">
    <h3 class="mt-5 mb-5">表面処理リスト</h3>

    <div class="list-group list-group-flush mb-2">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6 id="label_name_and_category">処理名 / カテゴリー</h6>
          <h6 id="label_maker_name">メーカー名</h6>
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
          <h6>{{ sample.maker }}</h6>
        </div>
        <div class="d-flex w-100 justify-content-between">
          <h6>{{ sample.category }}</h6>
          <h6>{{ sample.color }}</h6>
        </div>
      </RouterLink>
    </div>

    <ul v-if="totalPages > 0"  class="pagination justify-content-center mb-5" id="pagination">
      <li class="page-item" :class="{ disabled: currentPage === 1 }" id="pagination_previous_page">
        <RouterLink class="page-link" v-if="currentPage > 1" v-bind:to="getPageLink(currentPage - 1)">前ページ</RouterLink>
        <span v-else class="page-link">前ページ</span>
      </li>

      <li v-for="page in totalPages" v-bind:key="page" class="page-item" v-bind:class="{ active: page === currentPage }">
        <RouterLink class="page-link" v-bind:to="getPageLink(page)">{{ page }}</RouterLink>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }" id="pagination_next_page">
        <RouterLink class="page-link" v-if="currentPage < totalPages" v-bind:to="getPageLink(currentPage + 1)">次ページ</RouterLink>
        <span v-else class="page-link">次ページ</span>
      </li>
    </ul>

    <div class="d-flex justify-content-evenly">
      <RouterLink to="#" id="link_samples_new">表面処理情報の登録</RouterLink>
      <RouterLink to="/home" id="link_home">メインメニューへ</RouterLink>
    </div>
  </div>
</template>
