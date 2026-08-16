<script setup>
import { ref, onMounted, computed } from 'vue'
import { checkLoginStatus } from '@/components/utils.js'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const route = useRoute()
const samples = ref([])
const minFilmThickness = route.query.min_film_thickness
const maxFilmThickness = route.query.max_film_thickness

const fetchSamples = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/film_thickness_search`, {
      params: { min_film_thickness: minFilmThickness, max_film_thickness: maxFilmThickness },
    })
    samples.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'サンプルの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const searchResultMessage = computed(() => {
  return `${ minFilmThickness } μm から ${ maxFilmThickness } μm の範囲で ${ samples.value.length } 件該当`
})

onMounted(async () => {
  await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  await fetchSamples()
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      表面処理の検索結果
    </h3>

    <div class="fs-5 text-center mb-5">
      {{ searchResultMessage }}
    </div>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item">
        <div class="d-flex w-100 justify-content-between">
          <div class="fs-6 mb-1">
            処理名 / 膜厚
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
            {{ sample.film_thickness }}
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
        <RouterLink to="/static_pages/film_thickness">
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
