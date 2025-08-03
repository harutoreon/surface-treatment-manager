<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const route = useRoute()
const router = useRouter()
const department = ref('')

const fetchDepartmentData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/departments/${id}`)
    department.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '部署情報の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

onMounted(() => {
  fetchDepartmentData(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      部署情報の編集
    </h3>

    <form>
      <label class="form-label" for="department-name">
        部署名
      </label>
      <input
        v-model="department.name"
        class="form-control mb-4"
        type="text"
        id="department-name"
      >

      <button type="submit" class="form-control btn btn-primary mb-5">
        更新
      </button>
    </form>

    <div class="d-flex justify-content-evenly">
      <RouterLink v-bind:to="`/departments/${department.id}`">
        部署情報へ
      </RouterLink>
      <RouterLink to="/departments">
        部署リストへ
      </RouterLink>
    </div>
  </div>
</template>
