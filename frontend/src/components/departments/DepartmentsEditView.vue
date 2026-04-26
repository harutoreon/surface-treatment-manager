<script setup>
import { onMounted } from 'vue'
import { useDepartments } from '@/composables/useDepartments.js'

const emit = defineEmits(['message'])
const { route, router, department, errorMessage, fetchDepartmentData, departmentUpdate, loggedIn } = useDepartments(emit)

const cancel = () => {
  router.push(`/departments/${department.value.id}`)
}

onMounted(async () => {
  if (await loggedIn) {
    await fetchDepartmentData(route.params.id)
  }
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      部署情報の編集
    </h3>

    <form @submit.prevent="departmentUpdate">
      <label class="form-label" for="department-name">
        部署名
      </label>
      <input
        id="department-name"
        v-model="department.name"
        class="form-control mb-4 shadow-sm"
        type="text"
      />

      <div class="d-grid gap-2 d-md-block">
        <button type="submit" class="btn btn-primary me-md-2 shadow">
          更新
        </button>
        <button
          v-if="department.id"
          type="button"
          class="btn btn-outline-secondary shadow-sm"
          @click="cancel"
        >
          キャンセル
        </button>
      </div>
    </form>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>
