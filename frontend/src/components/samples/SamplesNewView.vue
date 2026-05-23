<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.js'
import { useSamplesNew } from '@/composables/samples/useSamplesNew.ts'
import type { Emit } from '@/composables/samples/useSamplesNew.ts'

const emit = defineEmits<Emit>()

const router = useRouter()
const category = ref<string>('')
const maker = ref<string>('')
const imageSizeErrorMessage = ref<string>('')
const previewImage = ref<string>('')

const {
  makerOptions,
  categoryOptions,
  name,
  color,
  hardness,
  feature,
  categoryId,
  makerId,
  filmThickness,
  summary,
  image,
  errorMessage,
  fetchMakerData,
  fetchCategories,
  sampleRegistration
} = useSamplesNew(emit)

const handleCategoryChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selected = categoryOptions.value.find(
    option => option.item === target.value
  )
  categoryId.value = selected?.id ?? null
}

const handleMakerChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selected = makerOptions.value.find(
    option => option.name === target.value
  )
  makerId.value = selected?.id ?? null
}

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
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
    const result = e.target?.result
   if (typeof result === 'string') {
     previewImage.value = result
   }
  }
  image.value = file
  reader.readAsDataURL(file)
}

onMounted(async (): Promise<void> => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (loggedIn) {
    await fetchCategories()
    await fetchMakerData()
  }
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
            class="form-control mb-3 shadow-sm"
            type="text"
          />
        </div>
        <div class="col">
          <label class="form-label" for="sample-category">
            カテゴリー
          </label>
          <select
            id="sample-category"
            v-model="category"
            class="form-select mb-3 shadow-sm"
            @change="handleCategoryChange"
          >
            <option value="">
              カテゴリーを選択して下さい
            </option>
            <option
              v-for="option in categoryOptions"
              :key="option.id"
              :value="option.item"
            >
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
            class="form-control mb-3 shadow-sm"
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
            class="form-select mb-4 shadow-sm"
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
            class="form-control mb-3 shadow-sm"
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
            class="form-control mb-3 shadow-sm"
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
            class="form-control mb-3 shadow-sm"
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
            class="form-control mb-3 shadow-sm"
            type="text"
          />
        </div>
      </div>

      <label class="form-label" for="sample-image">
        画像
      </label>
      <div>
        <img
          v-if="previewImage"
          id="preview-image"
          :src="previewImage"
          alt="プレビュー画像"
          class="rounded-4 mb-3 shadow-sm"
          width="200"
          height="200"
        />
      </div>
      <input
        id="sample-image"
        class="form-control mb-4 shadow-sm"
        accept="image/jpeg,image/gif,image/png,image/jpg"
        type="file"
        @change="handleFileChange"
      />

      <p v-if="imageSizeErrorMessage" class="text-danger mt-4">
        {{ imageSizeErrorMessage }}
      </p>

      <button type="submit" class="form-control btn btn-primary mb-5 shadow">
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
