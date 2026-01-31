<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const options = ref([])
const name = ref('')
const category = ref('')
const color = ref('')
const maker = ref('')
const hardness = ref('')
const filmThickness = ref('')
const feature = ref('')
const summary = ref('')
const image = ref(null)
const errorMessage = ref('')
const imageSizeErrorMessage = ref('')
const previewImage = ref('')
const makerOptions = ref('')
const makerId = ref(null)

const handleMakerChange = (event) => {
  const selected = makerOptions.value.find(
    option => option.name === event.target.value
  )
  makerId.value = selected?.id || null
}

const fetchMakerData = async () => {
  const response = await axios.get(`${API_BASE_URL}/maker_list`)
  makerOptions.value = response.data
}

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

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const imageSize = file.size

  if (imageSize > 5000000) {
    imageSizeErrorMessage.value = '5MB未満のファイルに変更して下さい。'
    previewImage.value = ''
    image.value = null
    return
  }

  imageSizeErrorMessage.value = ''
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  image.value = file
  reader.readAsDataURL(file)
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
    formData.append('sample[summary]', summary.value)
    if (image.value) {
      formData.append('sample[image]', image.value)
    }

    const response = await axios.post(`${API_BASE_URL}/makers/${makerId.value}/samples`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    emit('message', { type: 'success', text: '表面処理情報を1件登録しました。' })
    router.push(`/samples/${response.data.id}`)
  } catch {
    errorMessage.value = '入力に不備があります。'
  }
}

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchCategories()
  await fetchMakerData()
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      表面処理情報の登録
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>
    
    <form @submit.prevent="sampleRegistration">
      <div class="row">
        <div class="col">
          <label class="form-label" for="sample-name">
            処理名
          </label>
          <input
            id="sample-name"
            v-model="name"
            class="form-control mb-3"
            type="text"
          />
        </div>
        <div class="col">
          <label class="form-label" for="sample-category">
            カテゴリー
          </label>
          <select id="sample-category" v-model="category" class="form-select mb-3">
            <option value="">
              カテゴリーを選択して下さい
            </option>
            <option v-for="option in options" :key="option.id" :value="option.item">
              {{ option.item }}
            </option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label class="form-label" for="sample-color">
            色
          </label>
          <input
            id="sample-color"
            v-model="color"
            class="form-control mb-3"
            type="text"
          />
        </div>
        <div class="col">
          <label class="form-label" for="makers">
            メーカー
          </label>
          <select
            id="makers"
            v-model="maker"
            class="form-select mb-4"
            @change="handleMakerChange"
          >
            <option value="">
              メーカーを選択して下さい
            </option>
            <option
              v-for="option in makerOptions"
              :key="option.id"
              :value="option.name"
            >
              {{ option.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label class="form-label" for="sample-hardness">
            硬度
          </label>
          <input
            id="sample-hardness"
            v-model="hardness"
            class="form-control mb-3"
            type="text"
          />
        </div>
        <div class="col">
          <label class="form-label" for="sample-film-thickness">
            膜厚
          </label>
          <input
            id="sample-film-thickness"
            v-model="filmThickness"
            class="form-control mb-3"
            type="text"
          />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label class="form-label" for="sample-feature">
            特徴
          </label>
          <input
            id="sample-feature"
            v-model="feature"
            class="form-control mb-3"
            type="text"
          />
        </div>
        <div class="col">
          <label class="form-label" for="sample-summary">
            概要
          </label>
          <input
            id="sample-summary"
            v-model="summary"
            class="form-control mb-3"
            type="text"
          />
        </div>
      </div>

      <label class="form-label" for="sample-image">
        画像
      </label>
      <div>
        <img
          id="preview-image"
          alt="No Image"
          class="mb-3"
          width="200"
          height="200"
          :src="previewImage || ''"
        />
      </div>
      <input
        id="sample-image"
        class="form-control mb-4"
        accept="image/jpeg,image/gif,image/png,image/jpg"
        type="file"
        @change="handleFileChange"
      />

      <p v-if="imageSizeErrorMessage" class="text-danger mt-4">
        {{ imageSizeErrorMessage }}
      </p>

      <button type="submit" class="form-control btn btn-primary mb-5">
        登録
      </button>
    </form>

    <ul class="nav justify-content-center mb-5">
      <li class="nav-item">
        <RouterLink to="/samples">
          表面処理リストへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>