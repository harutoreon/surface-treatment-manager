<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const maker = ref({
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

const fetchMakerData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/makers/${id}`)
    maker.value = response.data
  } catch (error) {
    console.error('Get maker information failed.')
  }
}

onMounted(() => {
  fetchMakerData(route.params.id)
})
</script>

<template>
  <div class="container d-flex justify-content-center">
    <div class="custom-width">
      <h3 class="text-center mt-5 mb-5">メーカー情報</h3>

      <div class="list-group mb-5">
        <li class="d-flex justify-content-between list-group-item">
          <div id="label-maker-name">メーカー名:</div>
          <div id="maker-name">{{ maker.name }}</div>
        </li>
        <li class="d-flex justify-content-between list-group-item">
          <div id="label-postal-code">郵便番号:</div>
          <div id="postal-code">{{ maker.postal_code }}</div>
        </li>
        <li class="d-flex justify-content-between list-group-item">
          <div id="label-address">住所:</div>
          <div id="address">{{ maker.address }}</div>
        </li>
        <li class="d-flex justify-content-between list-group-item">
          <div id="label-phone-number">電話番号:</div>
          <div id="phone-number">{{ maker.phone_number }}</div>
        </li>
        <li class="d-flex justify-content-between list-group-item">
          <div id="labal-fax-number">FAX番号:</div>
          <div id="fax-number">{{ maker.fax_number }}</div>
        </li>
        <li class="d-flex justify-content-between list-group-item">
          <div id="label-email-address">Email:</div>
          <div id="email-address">{{ maker.email }}</div>
        </li>
        <li class="d-flex justify-content-between list-group-item">
          <div id="label-home-page-address">ホームページ:</div>
          <div id="home-page-address">{{ maker.home_page }}</div>
        </li>
        <li class="d-flex justify-content-between list-group-item">
          <div id="label-person-in-charge">担当者:</div>
          <div id="person-in-charge">{{ maker.manufacturer_rep }}</div>
        </li>
      </div>

      <div class="d-flex justify-content-evenly">
        <RouterLink v-if="maker.id" v-bind:to="`/makers/${maker.id}/edit`" id="maker-edit">メーカー情報の編集へ</RouterLink>
        <RouterLink to="#" id="maker-destroy">メーカー情報の削除</RouterLink>
        <RouterLink to="/makers" id="maker-list">メーカーリストへ</RouterLink>
      </div>
    </div>
  </div>
</template>

<style>
.custom-width {
  width: 45%;
}
</style>
