<script setup>
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const sample = ref('')
const name = ref('')
const category = ref('')
const color = ref('')
const maker = ref('')
const hardness = ref('')
const filmThickness = ref('')
const feature = ref('')
const picture = ref(null)
const errorMessage = ref('')

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    picture.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      const previewImage = document.getElementById('preview_image')
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
    if (picture.value) {
      formData.append('sample[image]', picture.value)
    }

    const response = await axios.post(`${API_BASE_URL}/samples`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    sample.value = response.data
    emit('message', { type: 'success', text: '表面処理情報を1件登録しました。' })
    router.push(`/samples/${sample.value.id}`)
  } catch (error) {
    errorMessage.value = '入力に不備があります。'
  }
}
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">表面処理情報の登録</h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">{{ errorMessage }}</p>
    
    <form v-on:submit.prevent="sampleRegistration">
      <label class="form-label" for="sample_name" id="label_sample_name">処理名</label>
      <input v-model="name" class="form-control mb-3" type="text" id="sample_name" />

      <label class="form-label" for="sample_category" id="label_sample_category">カテゴリー</label>
      <select v-model="category" class="form-select mb-3" id="sample_category">
        <option value=""></option>
        <option value="めっき">めっき</option>
        <option value="陽極酸化">陽極酸化</option>
        <option value="化成">化成</option>
        <option value="コーティング">コーティング</option>
        <option value="表面硬化">表面硬化</option>
      </select>

      <label class="form-label" for="sample_color" id="label_sample_color">色調</label>
      <input v-model="color" class="form-control mb-3" type="text" id="sample_color" />

      <label class="form-label" for="sample_maker" id="label_sample_maker">メーカー</label>
      <input v-model="maker" class="form-control mb-3" type="text" id="sample_maker" />

      <label class="form-label" for="sample_hardness" id="label_sample_hardness">硬度</label>
      <input v-model="hardness" class="form-control mb-3" type="text" id="sample_hardness" />

      <label class="form-label" for="sample_film_thickness" id="label_sample_film_thickness">膜厚</label>
      <input v-model="filmThickness" class="form-control mb-3" type="text" id="sample_film_thickness" />

      <label class="form-label" for="sample_feature" id="label_sample_feature">特徴</label>
      <input v-model="feature" class="form-control mb-3" type="text" id="sample_feature" />

      <label class="form-label" for="sample_picture" id="label_sample_picture">画像</label>
      <div><img alt="No Image" class="mb-3" id="preview_image" width="200" height="200" src="" /></div>
      <input
        class="form-control mb-4"
        accept="image/jpeg,image/gif,image/png,image/jpg"
        type="file"
        id="sample_picture"
        v-on:change="handleFileChange"
      />

      <button type="submit" class="form-control btn btn-primary mb-5">登録</button>
    </form>

    <div class="text-center mb-5">
      <RouterLink to="/samples">表面処理リストへ</RouterLink>
    </div>
  </div>
</template>