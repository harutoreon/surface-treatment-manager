<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const samplesWithImage = ref([])
const samplesWithoutImage = ref([])

const fetchSearchResults = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list_search`)
  samplesWithoutImage.value = response.data

  for (let i = 0; i < samplesWithoutImage.value.length; i++) {
    const response = await axios.get(`${API_BASE_URL}/samples/${samplesWithoutImage.value[i].id}`)
    samplesWithImage.value.push(response.data)
  }    
  } catch (error) {
    console.error('検索結果の取得に失敗しました', error)
  }
}

onMounted(() => {
  fetchSearchResults()
})
</script>

<template>
  <div class="container">
    <h3 class="text-center mt-5 mb-5">表面処理一覧</h3>

    <div class="album">
      <div class="row row-cols-5 g-3">
        <div v-for="sample in samplesWithImage" v-bind:key="sample.id" class="col">
          <div class="card">
            <img
              v-bind:src="sample.image_url"
              class="card-img-top"
              alt="Sample Image"
              width="100%"
              height="225"
            >
            <div class="card-body">
              <h5 class="card-title mb-3">{{ sample.name }}</h5>
              <p class="card-text">電気を使わずに化学反応を利用して金属や樹脂などの表面にニッケルの薄膜を形成する表面処理技術です。</p>
              <RouterLink v-bind:to="`/samples/${sample.id}`" class="btn btn-primary" v-bind:ref="`linkSample${sample.id}`">詳細へ</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-evenly mt-5 mb-5">
      <RouterLink to="/home" id="link_home" ref="linkHome">メインメニューへ</RouterLink>
    </div>
  </div>
</template>