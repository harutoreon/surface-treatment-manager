<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

interface MakerResponse {
  id: string
  name: string
  postal_code: string
  address: string
  phone_number: string
  fax_number: string
  email: string
  home_page: string
  manufacturer_rep: string
}

interface MessageEvent {
  type: 'danger' | 'success' | 'warning' | 'info'
  text: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

const emit = defineEmits<{
  message: [payload: MessageEvent]
}>()

const route = useRoute()
const router = useRouter()

const maker = ref<MakerResponse>({
  id: '',
  name: '',
  postal_code: '',
  address: '',
  phone_number: '',
  fax_number: '',
  email: '',
  home_page: '',
  manufacturer_rep: ''
})

const errorMessage = ref<string>('')

const fetchMakerData = async (id: string): Promise<void> => {
  try {
    const response = await axios.get<MakerResponse>(`${API_BASE_URL}/makers/${id}`)
    maker.value = response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      emit('message', { type: 'danger', text: 'メーカー情報の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const makerUpdate = async () => {
  try {
    const response = await axios.patch<MakerResponse>(`${API_BASE_URL}/makers/${maker.value.id}`, {
      name: maker.value.name,
      postal_code: maker.value.postal_code,
      address: maker.value.address,
      phone_number: maker.value.phone_number,
      fax_number: maker.value.fax_number,
      email: maker.value.email,
      home_page: maker.value.home_page,
      manufacturer_rep: maker.value.manufacturer_rep
    })
    maker.value = response.data
    emit('message', { type: 'success', text: 'メーカー情報を更新しました。' })
    router.push(`/makers/${maker.value.id}`)
  } catch(error) {
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      errorMessage.value = '入力に不備があります。'
    }
  }
}

const cancel = (): void => {
  router.push(`/makers/${maker.value.id as string}`)
}

onMounted(async (): Promise<void> => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchMakerData(route.params.id as string)
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      メーカー情報の編集
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <form @submit.prevent="makerUpdate">
      <div class="row">
        <div class="col">
          <label class="form-label" for="maker-name">
            メーカー名
          </label>
          <input
            id="maker-name"
            v-model="maker.name"
            class="form-control mb-2 shadow-sm"
            type="text"
          />
        </div>
        <div class="col">
          <label class="form-label" for="maker-postal-code">
            郵便番号
          </label>
          <input
            id="maker-postal-code"
            v-model="maker.postal_code"
            class="form-control mb-2 shadow-sm"
            type="text"
          />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label class="form-label" for="maker-address">
            住所
          </label>
          <input
            id="maker-address"
            v-model="maker.address"
            class="form-control mb-2 shadow-sm"
            type="text"
          />
        </div>
        <div class="col">
          <label class="form-label" for="maker-phone-number">
            電話番号
          </label>
          <input
            id="maker-phone-number"
            v-model="maker.phone_number"
            class="form-control mb-2 shadow-sm"
            type="tel"
          />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label class="form-label" for="maker-fax-number">
            FAX番号
          </label>
          <input
            id="maker-fax-number"
            v-model="maker.fax_number"
            class="form-control mb-2 shadow-sm"
            type="tel"
          />
        </div>
        <div class="col">
          <label class="form-label" for="maker-email">
            Email
          </label>
          <input
            id="maker-email"
            v-model="maker.email"
            class="form-control mb-2 shadow-sm"
            type="email"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label class="form-label" for="maker-home-page">
            ホームページ
          </label>
          <input
            id="maker-home-page"
            v-model="maker.home_page"
            class="form-control mb-2 shadow-sm"
            type="url"
          />
        </div>
        <div class="col">
          <label class="form-label" for="maker-manufacturer-rep">
            担当者
          </label>
          <input
            id="maker-manufacturer-rep"
            v-model="maker.manufacturer_rep"
            class="form-control mb-3 shadow-sm"
            type="text"
          />
        </div>
      </div>

      <div class="d-grid gap-2 d-md-block">
        <button type="submit" class="btn btn-primary me-md-2 shadow">
          更新
        </button>
        <button
          v-if="maker.id"
          type="button"
          class="btn btn-outline-secondary shadow-sm"
          @click="cancel"
        >
          キャンセル
        </button>
      </div>
    </form>
  </div>
</template>