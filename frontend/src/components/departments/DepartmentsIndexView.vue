<script setup>
import { onMounted } from 'vue'
import { useDepartments } from '@/composables/useDepartments.js'

const emit = defineEmits(['message'])
const { departments, fetchDepartmentList, loggedIn } = useDepartments(emit)

onMounted(async () => {
  if (await loggedIn) {
    await fetchDepartmentList()
  }
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      部署リスト
    </h3>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item">
        <div class="d-flex justify-content-center">
          <span class="mb-1">部署名</span>
        </div>
      </div>

      <RouterLink
        v-for="department in departments"
        :key="department.id"
        class="list-group-item list-group-item-action"
        :to="`/departments/${department.id}`"
      >
        <div class="d-flex justify-content-center">
          <div>{{ department.name }}</div>
        </div>
      </RouterLink>
    </div>

    <ul class="nav justify-content-evenly">
      <li class="nav-item">
        <RouterLink to="/departments/new">
          部署情報の登録へ
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/home">
          メインメニューへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
