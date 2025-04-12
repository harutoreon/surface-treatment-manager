<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const router = useRouter()
const maker = ref('')
const errorMessage = ref('')

const fetchMakerData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/makers/${id}`)
    maker.value = response.data
  } catch (error) {
    console.error('Get maker data failed')
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
    router.push(`/makers/${maker.value.id}`)
  } catch (error) {
    errorMessage.value = '入力に不備があります。'
  }
}

onMounted(() => {
  fetchMakerData(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">メーカー情報の編集</h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">{{ errorMessage }}</p>

    <form v-on:submit.prevent="makerUpdate">
      <label class="form-label" for="maker_name">メーカー名</label>
      <input v-model="maker.name" class="form-control mb-2" type="text" id="maker_name" />
      
      <label class="form-label" for="maker_postal_code">郵便番号</label>
      <input v-model="maker.postal_code" class="form-control mb-2" style="width: 10rem;" type="text" id="maker_postal_code" />
      
      <label class="form-label" for="maker_address">住所</label>
      <input v-model="maker.address" class="form-control mb-2" type="text" id="maker_address" />
      
      <label class="form-label" for="maker_phone_number">電話番号</label>
      <input v-model="maker.phone_number" class="form-control mb-2" style="width: 10rem;" type="tel" id="maker_phone_number" />
      
      <label class="form-label" for="maker_fax_number">FAX番号</label>
      <input v-model="maker.fax_number" class="form-control mb-2" style="width: 10rem;" type="tel" id="maker_fax_number" />
      
      <label class="form-label" for="maker_email">Email</label>
      <input v-model="maker.email" class="form-control mb-2" type="email" id="maker_email" />
      
      <label class="form-label" for="maker_home_page">ホームページ</label>
      <input v-model="maker.home_page" class="form-control mb-2" type="url" id="maker_home_page" />
      
      <label class="form-label" for="maker_manufacturer_rep">担当者</label>
      <input v-model="maker.manufacturer_rep" class="form-control mb-3" type="text" id="maker_manufacturer_rep"/>
      
      <button type="submit" class="form-control btn btn-primary mb-5">更新</button>
    </form>

    <div class="d-flex justify-content-evenly">
      <RouterLink v-bind:to="`/makers/${maker.id}`" id="maker_information">メーカー情報へ</RouterLink>
      <RouterLink to="/makers" id="maker_list">メーカーリストへ</RouterLink>
    </div>
  </div>
</template>