<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const emit = defineEmits(['message'])
const department = ref('')
const route = useRoute()
const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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
      部署情報
    </h3>

    <ul class="list-group mb-5">
      <li class="d-flex justify-content-between list-group-item">
        <div>部署名 :</div>
        <div>{{ department.name }}</div>
      </li>
    </ul>

    <div class="d-flex justify-content-evenly">
      <RouterLink v-bind:to="`/departments/${department.id}/edit`" ref="linkDepartmentsEdit">
        部署情報の編集へ
      </RouterLink>
      <RouterLink to="/departments" ref="linkDepartments">
        部署リストへ
      </RouterLink>
    </div>
  </div>
</template>
