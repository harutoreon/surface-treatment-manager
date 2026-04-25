<script setup>
import { onMounted } from 'vue'
import { useDepartments } from '@/composables/useDepartments.js'

const emit = defineEmits(['message'])
const { name, errorMessage, departmentRegistration, loggedIn } = useDepartments(emit)

onMounted(async () => {
  await loggedIn
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      部署情報の登録
    </h3>

    <form @submit.prevent="departmentRegistration">
      <label class="form-label" for="department-name">
        部署名
      </label>
      <input
        id="department-name"
        v-model="name"
        class="form-control mb-4 shadow-sm"
        type="text"
      />
      
      <button type="submit" class="form-control btn btn-primary mb-5 shadow">
        登録
      </button>
    </form>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <ul class="nav justify-content-center">
      <li class="nav-item">
        <RouterLink to="/departments" class="d-flex justify-content-evenly">
          部署リストへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
