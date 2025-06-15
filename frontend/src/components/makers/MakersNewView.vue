<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const maker = ref('')
const name = ref('')
const postalCode = ref('')
const address = ref('')
const phoneNumber = ref('')
const faxNumber = ref('')
const email = ref('')
const homePage = ref('')
const manufacturerRep = ref('')
const errorMessage = ref('')

const makerRegistration = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/makers`, {
      maker: {
        name: name.value,
        postal_code: postalCode.value,
        address: address.value,
        phone_number: phoneNumber.value,
        fax_number: faxNumber.value,
        email: email.value,
        home_page: homePage.value,
        manufacturer_rep: manufacturerRep.value
      }
    })
    maker.value = response.data
    emit('message', { type: 'success', text: 'メーカー情報を1件登録しました。' })
    router.push(`/makers/${maker.value.id}`)
  } catch {
    errorMessage.value = '入力に不備があります。'
  }
}
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      メーカー情報の登録
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <form v-on:submit.prevent="makerRegistration">
      <label class="form-label" for="maker-name">
        メーカー名
      </label>
      <input
        v-model="name"
        class="form-control mb-2"
        type="text"
        id="maker-name"
        required
      >
      
      <label class="form-label" for="maker-postal-code">
        郵便番号
      </label>
      <input
        v-model="postalCode"
        class="form-control mb-2"
        style="width: 10rem;"
        type="text"
        id="maker-postal-code"
      >
      
      <label class="form-label" for="maker-address">
        住所
      </label>
      <input
        v-model="address"
        class="form-control mb-2"
        type="text"
        id="maker-address"
      >
      
      <label class="form-label" for="maker-phone-number">
        電話番号
      </label>
      <input
        v-model="phoneNumber"
        class="form-control mb-2"
        style="width: 10rem;"
        type="tel"
        id="maker-phone-number"
      >
      
      <label class="form-label" for="maker-fax-number">
        FAX番号
      </label>
      <input
        v-model="faxNumber"
        class="form-control mb-2"
        style="width: 10rem;"
        type="tel"
        id="maker-fax-number"
      >
      
      <label class="form-label" for="maker-email">
        Email
      </label>
      <input
        v-model="email"
        class="form-control mb-2"
        type="email"
        id="maker-email"
      >
      
      <label class="form-label" for="maker-home-page">
        ホームページ
      </label>
      <input
        v-model="homePage"
        class="form-control mb-2"
        type="url"
        id="maker-home-page"
      >
      
      <label class="form-label" for="maker-manufacturer-rep">
        担当者
      </label>
      <input
        v-model="manufacturerRep"
        class="form-control mb-3"
        type="text"
        id="maker-manufacturer-rep"
      >
      
      <button type="submit" class="form-control btn btn-primary mb-5">
        登録
      </button>
    </form>

    <div class="d-flex justify-content-center">
      <RouterLink to="/makers" ref="linkMakers">
        メーカーリストへ
      </RouterLink>
    </div>
  </div>
</template>