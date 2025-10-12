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
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      表面処理の検索結果
    </h3>

    <h5 class="text-center mb-5">
      検索文字列：「{{ data.keyword }}」
    </h5>

    <div class="list-group list-group-flush mb-3">
      <div class="list-group-item">
        <div class="d-flex w-100 justify-content-between">
          <h6>処理名 / カテゴリー</h6>
          <h6>メーカー名</h6>
        </div>
      </div>
      <RouterLink
        v-for="sample in samples"
        v-bind:key="sample.id"
        v-bind:to="`/samples/${sample.id}`"
        class="list-group-item list-group-item-action"
      >
        <div class="d-flex justify-content-between">
          <h6>{{ sample.name }}</h6>
          <h6>{{ sample.maker }}</h6>
        </div>
        <h6 class="text-start">
          {{ sample.category }}
        </h6>
      </RouterLink>
      <h4 v-if="samples.length === 0" class="text-center m-5">
        該当する表面処理はありませんでした。
      </h4>
    </div>

    <div class="d-flex justify-content-evenly mt-5 mb-5">
      <RouterLink v-bind:to="`/static_pages/${searchMethod}`" id="link_research" ref="linkResearch">
        再検索
      </RouterLink>
      <RouterLink to="/home" id="link_home" ref="linkHome">
        メインメニューへ
      </RouterLink>
    </div>
  </div>
</template>
