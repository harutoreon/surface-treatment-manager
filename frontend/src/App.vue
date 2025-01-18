<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const data = ref([])

const loadData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/samples/2')
    data.value = response.data
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <h2>表面処理情報</h2>
  <p>表面処理名 : {{ data.name }}</p>
  <p>カテゴリー : {{ data.category }}</p>
  <p>カラー : {{ data.color }}</p>
  <p>メーカー名 : {{ data.color }}</p>
  <p>作成日 : {{ data.color }}</p>
  <p>更新日 : {{ data.color }}</p>
  <p>画像 : {{ data.picture }}</p>
  <p>硬度 : {{ data.hardness }}</p>
  <p>膜厚 : {{ data.film_thickness }}</p>
  <p>特徴 : {{ data.feature }}</p>
</template>
