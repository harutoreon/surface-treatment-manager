<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const sample = ref('')
const name = ref('')
const category = ref('')
const color = ref('')
const maker = ref('')
const hardness = ref('')
const filmThickness = ref('')
const feature = ref('')
const image = ref(null)
const errorMessage = ref('')

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    image.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      const previewImage = document.getElementById('preview-image')
      if (previewImage) {
        previewImage.src = e.target.result
      }
    }
    reader.readAsDataURL(file)
  }
}

const sampleRegistration = async () => {
  try {
    const formData = new FormData()
    formData.append('sample[name]', name.value)
    formData.append('sample[category]', category.value)
    formData.append('sample[color]', color.value)
    formData.append('sample[maker]', maker.value)
    formData.append('sample[hardness]', hardness.value)
    formData.append('sample[film_thickness]', filmThickness.value)
    formData.append('sample[feature]', feature.value)
    if (image.value) {
      formData.append('sample[image]', image.value)
    }

    const response = await axios.post(`${API_BASE_URL}/samples`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    sample.value = response.data
    emit('message', { type: 'success', text: '表面処理情報を1件登録しました。' })
    router.push(`/samples/${sample.value.id}`)
  } catch {
    errorMessage.value = '入力に不備があります。'
  }
}
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      表面処理情報の登録
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>
    
    <form v-on:submit.prevent="sampleRegistration">
      <label class="form-label" for="sample-name">
        処理名
      </label>
      <input
        v-model="name"
        class="form-control mb-3"
        type="text"
        id="sample-name"
      >

      <label class="form-label" for="sample-category">
        カテゴリー
      </label>
      <select v-model="category" class="form-select mb-3" id="sample-category">
        <option value=""></option>
        <option value="めっき">
          めっき
        </option>
        <option value="陽極酸化">
          陽極酸化
        </option>
        <option value="化成">
          化成
        </option>
        <option value="コーティング">
          コーティング
        </option>
        <option value="表面硬化">
          表面硬化
        </option>
      </select>

      <label class="form-label" for="sample-color">
        色調
      </label>
      <input
        v-model="color"
        class="form-control mb-3"
        type="text"
        id="sample-color"
      >

      <label class="form-label" for="sample-maker">
        メーカー
      </label>
      <input
        v-model="maker"
        class="form-control mb-3"
        type="text"
        id="sample-maker"
      >

      <label class="form-label" for="sample-hardness">
        硬度
      </label>
      <input
        v-model="hardness"
        class="form-control mb-3"
        type="text"
        id="sample-hardness"
      >

      <label class="form-label" for="sample-film-thickness">
        膜厚
      </label>
      <input
        v-model="filmThickness"
        class="form-control mb-3"
        type="text"
        id="sample-film-thickness"
      >

      <label class="form-label" for="sample-feature">
        特徴
      </label>
      <input
        v-model="feature"
        class="form-control mb-3"
        type="text"
        id="sample-feature"
      >

      <label class="form-label" for="sample-image">
        画像
      </label>
      <div>
        <img
          alt="No Image"
          class="mb-3"
          id="preview-image"
          width="200"
          height="200"
          src=""
        >
      </div>
      <input
        class="form-control mb-4"
        accept="image/jpeg,image/gif,image/png,image/jpg"
        type="file"
        id="sample-image"
        v-on:change="handleFileChange"
      />

      <button type="submit" class="form-control btn btn-primary mb-5">
        登録
      </button>
    </form>

    <div class="text-center mb-5">
      <RouterLink to="/samples" ref="linkSamples">
        表面処理リストへ
      </RouterLink>
    </div>
  </div>
</template>