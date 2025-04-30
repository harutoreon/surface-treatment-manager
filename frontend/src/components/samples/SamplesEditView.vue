<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const sample = ref('')
const route = useRoute()
const router = useRouter()
const picture = ref(null)
const errorMessage = ref('')

const fetchSampleData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/samples/${id}`)
    sample.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
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

    if (picture.value) {
      formData.append('sample[image]', picture.value)  
    }

    const response = await axios.patch(`${API_BASE_URL}/samples/${route.params.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    sample.value = response.data
    router.push(`/samples/${sample.value.id}`)
  } catch (error) {
    errorMessage.value = '入力に不備があります。'
  }
}

onMounted(() => {
  fetchSampleData(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">表面処理情報の編集</h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">{{ errorMessage }}</p>
    
    <form v-on:submit.prevent="sampleUpdate">
      <label class="form-label" for="sample_name" id="label_sample_name">処理名</label>
      <input v-model="sample.name" class="form-control mb-3" type="text" id="sample_name" />

      <label class="form-label" for="sample_category" id="label_sample_category">カテゴリー</label>
      <input v-model="sample.category" class="form-control mb-3" type="text" id="sample_category" />

      <label class="form-label" for="sample_color" id="label_sample_color">色調</label>
      <input v-model="sample.color" class="form-control mb-3" type="text" id="sample_color" />

      <label class="form-label" for="sample_maker" id="label_sample_maker">メーカー</label>
      <input v-model="sample.maker" class="form-control mb-3" type="text" id="sample_maker" />

      <label class="form-label" for="sample_hardness" id="label_sample_hardness">硬度</label>
      <input v-model="sample.hardness" class="form-control mb-3" type="text" id="sample_hardness" />

      <label class="form-label" for="sample_film_thickness" id="label_sample_film_thickness">膜厚</label>
      <input v-model="sample.film_thickness" class="form-control mb-3" type="text" id="sample_film_thickness" />

      <label class="form-label" for="sample_feature" id="label_sample_feature">特徴</label>
      <input v-model="sample.feature" class="form-control mb-3" type="text" id="sample_feature" />

      <label class="form-label" for="sample_picture" id="label_sample_picture">画像</label>
      <div>
        <img
          v-if="sample.image_url"
          v-bind:src="sample.image_url"
          alt="No Image"
          class="mb-3"
          id="preview_image"
          width="200"
          height="200"
        />
      </div>

      <button type="submit" class="form-control btn btn-primary mb-5">更新</button>
    </form>

    <div class="d-flex justify-content-evenly mb-5">
      <!-- <RouterLink to="/samples">表面処理リストへ</RouterLink> -->
      <a href="#" id="sample_show">表面処理情報へ</a>
      <a href="#" id="sample_list">表面処理リストへ</a>
    </div>
  </div>
</template>