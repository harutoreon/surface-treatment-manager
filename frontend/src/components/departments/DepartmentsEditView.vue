<script setup lang="ts">
import { onMounted } from 'vue'
import { useDepartments } from '@/composables/departments/useDepartments'
import { useAuthGuard } from '@/composables/auth/useAuthGuard'
import type { MessageEmit } from '@/env'
import { useRoute, useRouter } from 'vue-router'

const emit = defineEmits<MessageEmit>()
const route = useRoute()
const router = useRouter()

const { requireLogin } = useAuthGuard(emit)
const { department, errorMessage, fetchDepartmentData, departmentUpdate } = useDepartments(emit)

const cancel = () => {
  router.push(`/departments/${department.value.id}`)
}

onMounted(async () => {
  const loggedIn = await requireLogin()
  if (loggedIn) await fetchDepartmentData(route.params.id as string)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      部署情報の編集
    </h3>

    <form v-if="department" @submit.prevent="departmentUpdate">
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
