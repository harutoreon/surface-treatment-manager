<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const sampleData = ref([])
const data = ref([])
const selected = ref('')

const downloadData = async () => {
  try {
    const response = await axios.get(`https://surface-treatment-manager.onrender.com/samples`)
    sampleData.value = response.data
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

const loadData = async () => {
  try {
    const response = await axios.get(`https://surface-treatment-manager.onrender.com/samples/${selected.value}`)
    data.value = response.data
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(() => {
  downloadData()
  loadData()
})

watch(selected, loadData)
</script>

<template>
  <h2>表面処理の選択</h2>
  <select v-model="selected">
    <option disabled value="">1つ選択して下さい</option>
    <option v-for="sample in sampleData" :key="sample.id">{{ sample.id }}: {{ sample.name }}</option>
  </select>

  <h2>表面処理情報</h2>
  <p>表面処理名 : {{ data.name }}</p>
  <p>カテゴリー : {{ data.category }}</p>
  <p>カラー : {{ data.color }}</p>
  <p>メーカー名 : {{ data.maker }}</p>
  <p>作成日 : {{ data.created_at }}</p>
  <p>更新日 : {{ data.updated_at }}</p>
  <p>画像 : {{ data.picture }}</p>
  <p>硬度 : {{ data.hardness }}</p>
  <p>膜厚 : {{ data.film_thickness }}</p>
  <p>特徴 : {{ data.feature }}</p>
</template>
