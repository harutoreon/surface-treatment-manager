<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '../utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const sample = ref('')
const route = useRoute()
const router = useRouter()
const image = ref(null)
const errorMessage = ref('')

const fetchSampleData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/samples/${id}`)
    sample.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '表面処理情報の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const sampleUpdate = async () => {
  try {
    const formData = new FormData()
    formData.append('sample[name]', sample.value.name)
    formData.append('sample[category]', sample.value.category)
    formData.append('sample[color]', sample.value.color)
    formData.append('sample[maker]', sample.value.maker)
    formData.append('sample[hardness]', sample.value.hardness)
    formData.append('sample[film_thickness]', sample.value.film_thickness)
    formData.append('sample[feature]', sample.value.feature)
    formData.append('sample[summary]', sample.value.summary)

    if (image.value) {
      formData.append('sample[image]', image.value)  
    }

    const response = await axios.patch(`${API_BASE_URL}/samples/${route.params.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    sample.value = response.data
    emit('message', { type: 'success', text: '表面処理情報を更新しました。' })
    router.push(`/samples/${sample.value.id}`)
  } catch {
    errorMessage.value = '入力に不備があります。'
  }
}

onMounted(async () => {
  await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  await fetchSampleData(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      表面処理情報の編集
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>
    
    <form v-on:submit.prevent="sampleUpdate">
      <label class="form-label" for="sample-name">
        処理名
      </label>
      <input
        v-model="sample.name"
        class="form-control mb-3"
        type="text"
        id="sample-name"
      >

      <label class="form-label" for="sample-category">
        カテゴリー
      </label>
      <input
        v-model="sample.category"
        class="form-control mb-3"
        type="text"
        id="sample-category"
      >

      <label class="form-label" for="sample-color">
        色調
      </label>
      <input
        v-model="sample.color"
        class="form-control mb-3"
        type="text"
        id="sample-color"
      >

      <label class="form-label" for="sample-maker">
        メーカー
      </label>
      <input
        v-model="sample.maker"
        class="form-control mb-3"
        type="text"
        id="sample-maker"
      >

      <label class="form-label" for="sample-hardness">
        硬度
      </label>
      <input
        v-model="sample.hardness"
        class="form-control mb-3"
        type="text"
        id="sample-hardness"
      >

      <label class="form-label" for="sample-film-thickness">
        膜厚
      </label>
      <input
        v-model="sample.film_thickness"
        class="form-control mb-3"
        type="text"
        id="sample-film-thickness"
      >

      <label class="form-label" for="sample-feature">
        特徴
      </label>
      <input
        v-model="sample.feature"
        class="form-control mb-3"
        type="text"
        id="sample-feature"
      >

      <label class="form-label" for="sample-summary">
        概要
      </label>
      <input
        v-model="sample.summary"
        class="form-control mb-3"
        type="text"
        id="sample-summary"
      >

      <label class="form-label" for="sample-image">
        画像
      </label>
      <div>
        <img
          v-if="sample.image_url"
          v-bind:src="sample.image_url"
          alt="No Image"
          class="mb-3"
          id="sample-image"
          width="200"
          height="200"
        />
      </div>

      <button type="submit" class="form-control btn btn-primary mb-5">
        更新
      </button>
    </form>

    <div class="d-flex justify-content-evenly mb-5">
      <RouterLink v-bind:to="`/samples/${sample.id}`" ref="linkSamplesEdit">
        表面処理情報へ
      </RouterLink>
      <RouterLink to="/samples" ref="linkSamples">
        表面処理リストへ
      </RouterLink>
    </div>
  </div>
</template>