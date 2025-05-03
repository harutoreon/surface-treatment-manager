<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const data = ref('')
const samples = ref('')

const fetchSearchResults = async () => {
  const keyword = route.query.keyword

  try {
    const response = await axios.get(`${API_BASE_URL}/name_search`, {
      params: { keyword: keyword }
    })
    data.value = response.data
    samples.value = data.value.samples
  } catch (error) {
    console.error('Get samples failed.', error)
  }
}

onMounted(() => {
  fetchSearchResults()
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center mt-5 mb-5">表面処理の検索結果</h3>

    <h5 class="text-center mb-5">検索文字列：「{{ data.keyword }}」</h5>

    <div class="list-group list-group-flush mb-3">
      <div class="list-group-item">
        <div class="d-flex w-100 justify-content-between">
          <h6 id="label_name_category">処理名 / カテゴリー</h6>
          <h6 id="label_maker">メーカー名</h6>
        </div>
      </div>
      <RouterLink v-for="sample in samples" v-bind:key="sample.id" v-bind:to="`/samples/${sample.id}`" class="list-group-item list-group-item-action">
        <div class="d-flex justify-content-between">
          <h6>{{ sample.name }}</h6>
          <h6>{{ sample.maker }}</h6>
        </div>
        <h6 class="text-start">{{ sample.category }}</h6>
       </RouterLink>
      <h4 v-if="samples.length === 0" class="text-center m-5">該当する表面処理はありませんでした。</h4>
    </div>

    <div class="d-flex justify-content-evenly mt-5 mb-5">
      <RouterLink to="/static_pages/name" id="link_research">再検索</RouterLink>
      <RouterLink to="/home" id="link_home">メインメニューへ</RouterLink>
    </div>
  </div>
</template>