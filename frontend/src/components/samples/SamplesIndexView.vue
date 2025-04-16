<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const samples = ref('')

const fetchSampleList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/samples`)
    samples.value = response.data
  } catch (error) {
    console.error('Get sample list failed')
  }
}

onMounted(() => {
  fetchSampleList()
})
</script>


<template>
  <div class="container text-center w-50">
    <h3 class="mt-5 mb-5">表面処理リスト</h3>

    <div class="list-group list-group-flush mb-2">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6 id="label_name_and_category">処理名 / カテゴリー</h6>
          <h6 id="label_maker_name">メーカー名</h6>
        </div>
      </div>

      <a v-for="sample in samples" v-bind:key="sample.id" class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>{{ sample.name }}</h6>
          <h6>{{ sample.maker }}</h6>
        </div>
        <h6 class="text-start">{{ sample.category }}</h6>
      </a>
    </div>

    <ul class="pagination justify-content-center mb-5">
      <li class="page-item disabled">
        <a class="page-link" id="previous_page">前のページ</a>
      </li>
      <li class="page-item active">
        <a class="page-link" href="/samples?page=#">1</a>
      </li>
      <li class="page-item ">
        <a class="page-link" href="/samples?page=#">2</a>
      </li>
      <li class="page-item ">
        <a class="page-link" href="/samples?page=#">3</a>
      </li>
      <li class="page-item ">
        <a class="page-link" href="/samples?page=#">4</a>
      </li>
      <li class="page-item">
        <a class="page-link" id="next_page" href="/samples?page=#">次のページ</a>
      </li>
    </ul>

    <div class="d-flex justify-content-evenly">
      <a href="/samples/new">表面処理情報の登録</a>
      <a href="/home">メインメニューへ</a>
    </div>
  </div>
</template>
