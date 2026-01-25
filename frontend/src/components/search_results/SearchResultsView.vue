<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const route = useRoute()
const router = useRouter()
const data = ref('')
const samples = ref('')
const searchMethod = ref('')

const fetchSearchResults = async () => {
  const keyword = route.query.keyword
  searchMethod.value = route.params.searchMethod
  
  try {
    const response = await axios.get(`${API_BASE_URL}/${searchMethod.value}_search`, {
      params: { keyword: keyword }
    })
    data.value = response.data
    samples.value = data.value.samples
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'サンプルの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }    
  }
}

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchSearchResults()
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      表面処理の検索結果
    </h3>

    <div class="fs-5 text-center mb-5">
      検索文字列：「{{ data.keyword }}」
    </div>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item">
        <div class="d-flex w-100 justify-content-between">
          <div class="fs-6 mb-1">
            処理名 / カテゴリー
          </div>
          <div class="fs-6 mb-1">
            主な機能 / 色
          </div>
        </div>
      </div>
      <RouterLink
        v-for="sample in samples"
        :key="sample.id"
        :to="`/samples/${sample.id}`"
        class="list-group-item list-group-item-action"
      >
        <div class="d-flex justify-content-between">
          <div class="fs-6 mb-2">
            {{ sample.name }}
          </div>
          <div class="fs-6 mb-2">
            {{ sample.feature }}
          </div>
        </div>
        <div class="d-flex justify-content-between">
          <div class="fs-6 mb-1">
            {{ sample.category }}
          </div>
          <div class="fs-6 mb-1">
            {{ sample.color }}
          </div>
        </div>
      </RouterLink>
      <div v-if="samples.length === 0" class="fs-4 text-center m-5">
        該当する表面処理はありませんでした。
      </div>
    </div>

    <ul class="nav justify-content-evenly mb-5">
      <li class="nav-item">
        <RouterLink :to="`/static_pages/${searchMethod}`">
          再検索
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
