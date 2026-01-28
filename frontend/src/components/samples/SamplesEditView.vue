<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

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
    formData.append('sample[hardness]', sample.value.hardness)
    formData.append('sample[film_thickness]', sample.value.film_thickness)
    formData.append('sample[feature]', sample.value.feature)
    formData.append('sample[summary]', sample.value.summary)

    if (image.value) {
      formData.append('sample[image]', image.value)  
    }

    const response = await axios.patch(`${API_BASE_URL}/makers/${sample.value.maker_id}/samples/${sample.value.id}`, formData, {
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

const cancel = () => {
  router.push(`/samples/${sample.value.id}`)
}

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchSampleData(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      表面処理情報の編集
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>
    
    <form @submit.prevent="sampleUpdate">
      <label class="form-label" for="sample-name">
        処理名
      </label>
      <input
        id="sample-name"
        v-model="sample.name"
        class="form-control mb-3"
        type="text"
      />

      <label class="form-label" for="sample-category">
        カテゴリー
      </label>
      <input
        id="sample-category"
        v-model="sample.category"
        class="form-control mb-3"
        type="text"
      />

      <label class="form-label" for="sample-color">
        色
      </label>
      <input
        id="sample-color"
        v-model="sample.color"
        class="form-control mb-3"
        type="text"
      />

      <label class="form-label" for="sample-hardness">
        硬度
      </label>
      <input
        id="sample-hardness"
        v-model="sample.hardness"
        class="form-control mb-3"
        type="text"
      />

      <label class="form-label" for="sample-film-thickness">
        膜厚
      </label>
      <input
        id="sample-film-thickness"
        v-model="sample.film_thickness"
        class="form-control mb-3"
        type="text"
      />

      <label class="form-label" for="sample-feature">
        特徴
      </label>
      <input
        id="sample-feature"
        v-model="sample.feature"
        class="form-control mb-3"
        type="text"
      />

      <label class="form-label" for="sample-summary">
        概要
      </label>
      <input
        id="sample-summary"
        v-model="sample.summary"
        class="form-control mb-3"
        type="text"
      />

      <label class="form-label" for="sample-image">
        画像
      </label>
      <div>
        <img
          v-if="sample.image_url"
          id="sample-image"
          :src="sample.image_url"
          alt="No Image"
          class="mb-3"
          width="200"
          height="200"
        />
      </div>

      <div class="d-grid gap-2 d-md-block mb-5">
        <button type="submit" class="btn btn-primary me-md-2">
          更新
        </button>
        <button
          v-if="sample.id"
          type="button"
          class="btn btn-outline-secondary"
          @click="cancel"
        >
          キャンセル
        </button>
      </div>
    </form>
  </div>
</template>
