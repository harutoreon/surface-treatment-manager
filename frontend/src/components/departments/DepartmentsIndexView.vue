<script setup>
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
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '部署リストの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

onMounted(() => {
  fetchDepartmentList()
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      部署リスト
    </h3>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item">
        <div class="d-flex justify-content-center">
          <h6>部署名</h6>
        </div>
      </div>

      <RouterLink
        v-for="department in departments"
        v-bind:key="department.id"
        class="list-group-item list-group-item-action"
        v-bind:to="`/departments/${department.id}`"
      >
        <div class="d-flex justify-content-center">
          <h6>{{ department.name }}</h6>
        </div>
      </RouterLink>
    </div>

    <div class="d-flex justify-content-evenly">
      <RouterLink to="/departments/new">
        部署の登録へ
      </RouterLink>
      <RouterLink to="/home">
        メインメニューへ
      </RouterLink>
    </div>
  </div>
</template>
