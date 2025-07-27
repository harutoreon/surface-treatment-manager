<!-- <script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const departments = ref([])

const fetchDepartmentList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/departments`)
    departments.value = response.data
    console.log(departments.value)
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '部署名の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

onMounted(() => {
  fetchDepartmentList()
})
</script> -->

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      部署名リスト
    </h3>

    <!-- <div class="list-group list-group-flush mb-5">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>カテゴリー名</h6>
          <h6>概要</h6>
        </div>
      </div>

      <RouterLink
        v-for="category in categories"
        v-bind:key="category.id"
        class="list-group-item list-group-item-action"
        v-bind:to="`/categories/${category.id}`"
      >
        <div class="d-flex w-100 justify-content-between">
          <h6>{{ category.item }}</h6>
          <h6>{{ category.summary }}</h6>
        </div>        
      </RouterLink>
    </div> -->

    <!-- <div class="d-flex justify-content-evenly">
      <RouterLink to="/categories/new" ref="linkCategoriesNew">
        カテゴリー情報の登録
      </RouterLink>
      <RouterLink to="/home" ref="linkHome">
        メインメニューへ
      </RouterLink>
    </div> -->
  </div>
</template>
