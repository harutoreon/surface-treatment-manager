<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios, { AxiosError } from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

interface Maker {
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
const maker = ref<Maker>({
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

const fetchMakerData = async (id: string): Promise<void> => {
  try {
    const response = await axios.get<Maker>(`${API_BASE_URL}/makers/${id}`)
    maker.value = response.data
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response?.status === 404) {
      emit('message', { type: 'danger', text: 'メーカー情報の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const handleDelete = async (): Promise<void> => {
  const confirmDelete = window.confirm('本当に削除しますか？')
  if (!confirmDelete) return

  try {
    await axios.delete(`${API_BASE_URL}/makers/${route.params.id as string}`)
    emit('message', { type: 'success', text: 'メーカー情報を1件削除しました。' })
    router.push('/makers')
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response?.status === 404) {
      emit('message', { type: 'danger', text: 'メーカー情報の削除処理に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
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
      メーカー情報
    </h3>

    <div class="list-group mb-5 shadow-sm">
      <li class="d-flex justify-content-between list-group-item">
        <span>メーカー名:</span>
        <div>{{ maker.name }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>郵便番号:</span>
        <div>{{ maker.postal_code }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>住所:</span>
        <div>{{ maker.address }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>電話番号:</span>
        <div>{{ maker.phone_number }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>FAX番号:</span>
        <div>{{ maker.fax_number }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>Email:</span>
        <div>{{ maker.email }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>ホームページ:</span>
        <div>{{ maker.home_page }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>担当者:</span>
        <div>{{ maker.manufacturer_rep }}</div>
      </li>
    </div>

    <ul class="nav justify-content-evenly">
      <li class="nav-item">
        <RouterLink v-if="maker.id" :to="`/makers/${maker.id}/edit`">
          メーカー情報の編集へ
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/makers">
          メーカーリストへ
        </RouterLink>
      </li>
    </ul>

    <div class="d-flex justify-content-end mt-5">
      <button class="btn btn-outline-danger shadow-sm" type="button" @click="handleDelete">
        メーカー情報の削除
      </button>
    </div>
  </div>
</template>
