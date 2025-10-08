<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { checkLoginStatus } from '../utils.js'

const keyword = ref('')
const router = useRouter()
const options = ref([])
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`)
    options.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'カテゴリーの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }  
  }
}

const submitSearch = () => {
  router.push({
    name: 'SearchResults',
    params: { searchMethod: 'category' },
    query: { keyword: keyword.value }
  })
}

onMounted(async () => {
  await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  await fetchCategories()
})
</script>

<template>
  <div class="container text-center w-25">
    <h3 class="mt-5 mb-5">
      カテゴリーで検索
    </h3>
    <form v-on:submit.prevent="submitSearch">
      <select v-model="keyword" class="form-select mb-3" required>
        <option value="">
          カテゴリーを選択して下さい
        </option>
        <option v-for="option in options" v-bind:key="option.id" v-bind:value="option.item">
          {{ option.item }}
        </option>
      </select>
      <button type="submit" class="btn btn-secondary form-control mb-5">
        検索
      </button>
    </form>
    <div>
      <RouterLink to="/home" ref="linkHome">
        メインメニューへ
      </RouterLink>
    </div>
  </div>
</template>

