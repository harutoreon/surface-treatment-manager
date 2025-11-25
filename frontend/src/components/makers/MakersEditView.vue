<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const route = useRoute()
const router = useRouter()
const maker = ref('')
const errorMessage = ref('')

const fetchMakerData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/makers/${id}`)
    maker.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'メーカー情報の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const makerUpdate = async () => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/makers/${maker.value.id}`, {
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
  } catch {
    errorMessage.value = '入力に不備があります。'
  }
}

const cancel = () => {
  router.push(`/makers/${maker.value.id}`)
}

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchMakerData(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      メーカー情報の編集
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <form v-on:submit.prevent="makerUpdate">
      <label class="form-label" for="maker-name">
        メーカー名
      </label>
      <input
        v-model="maker.name"
        class="form-control mb-2"
        type="text"
        id="maker-name"
      />
      
      <label class="form-label" for="maker-postal-code">
        郵便番号
      </label>
      <input
        v-model="maker.postal_code"
        class="form-control mb-2"
        style="width: 10rem;"
        type="text"
        id="maker-postal-code"
      />
      
      <label class="form-label" for="maker-address">
        住所
      </label>
      <input
        v-model="maker.address"
        class="form-control mb-2"
        type="text"
        id="maker-address"
      />
      
      <label class="form-label" for="maker-phone-number">
        電話番号
      </label>
      <input
        v-model="maker.phone_number"
        class="form-control mb-2"
        style="width: 10rem;"
        type="tel"
        id="maker-phone-number"
      />
      
      <label class="form-label" for="maker-fax-number">
        FAX番号
      </label>
      <input
        v-model="maker.fax_number"
        class="form-control mb-2"
        style="width: 10rem;"
        type="tel"
        id="maker-fax-number"
      />
      
      <label class="form-label" for="maker-email">
        Email
      </label>
      <input
        v-model="maker.email"
        class="form-control mb-2"
        type="email"
        id="maker-email"
      />
      
      <label class="form-label" for="maker-home-page">
        ホームページ
      </label>
      <input
        v-model="maker.home_page"
        class="form-control mb-2"
        type="url"
        id="maker-home-page"
      />
      
      <label class="form-label" for="maker-manufacturer-rep">
        担当者
      </label>
      <input
        v-model="maker.manufacturer_rep"
        class="form-control mb-3"
        type="text"
        id="maker-manufacturer-rep"
      />

      <div class="d-grid gap-2 d-md-block">
        <button type="submit" class="btn btn-primary me-md-2">
          更新
        </button>
        <button
          v-if="maker.id"
          v-on:click="cancel"
          type="button"
          class="btn btn-outline-secondary"
        >
          キャンセル
        </button>
      </div>
    </form>
  </div>
</template>