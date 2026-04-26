<script setup>
import { onMounted } from 'vue'
import { useDepartments } from '@/composables/useDepartments.js'

const emit = defineEmits(['message'])
const { route, department, fetchDepartmentData, handleDelete, loggedIn } = useDepartments(emit)

onMounted(async () => {
  if (await loggedIn) {
    await fetchDepartmentData(route.params.id)
  }
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      部署情報
    </h3>

    <ul class="list-group mb-5 shadow-sm">
      <li class="d-flex justify-content-between list-group-item">
        <span>部署名 :</span>
        <div>{{ department.name }}</div>
      </li>
    </ul>

    <ul class="nav justify-content-evenly">
      <li class="nav-item">
        <RouterLink v-if="department.id" :to="`/departments/${department.id}/edit`">
          部署情報の編集へ
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/departments">
          部署リストへ
        </RouterLink>
      </li>
    </ul>

    <div class="d-flex justify-content-end mt-5">
      <button class="btn btn-outline-danger shadow-sm" type="button" @click="handleDelete">
        部署情報の削除
      </button>
    </div>
  </div>
</template>
