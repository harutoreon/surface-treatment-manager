<script setup>
import { onMounted } from 'vue'
import { useUsers } from '@/composables/useUsers.js'

const emit = defineEmits(['message'])
const {
  name,
  department,
  password,
  passwordConfirmation,
  options,
  errorMessage,
  fetchDepartments,
  userRegistration,
  loggedIn
} = useUsers(emit)

onMounted(async () => {
  if (await loggedIn) await fetchDepartments()
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      ユーザー情報の登録
    </h3>

    <form @submit.prevent="userRegistration">
      <label class="form-label" for="user-name">
        ユーザー名
      </label>
      <input
        id="user-name"
        v-model="name"
        class="form-control mb-3 shadow-sm"
        type="text"
        required
      />

      <label class="form-label" for="user-department">
        部署名
      </label>
      <select
        id="user-department"
        v-model="department"
        class="form-select mb-3 shadow-sm"
        required
      >
        <option value="">
          部署名を選択して下さい
        </option>
        <option v-for="option in options" :key="option.id" :value="option.name">
          {{ option.name }}
        </option>
      </select>

      <label class="form-label" for="user-password">
        パスワード
      </label>
      <input
        id="user-password"
        v-model="password"
        class="form-control mb-3 shadow-sm"
        type="password"
        required
      />

      <label class="form-label" for="user-password-confirmation">
        パスワードの確認
      </label>
      <input
        id="user-password-confirmation"
        v-model="passwordConfirmation"
        class="form-control mb-4 shadow-sm"
        type="password"
        required
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
        <RouterLink to="/users">
          ユーザーリスト
        </RouterLink>
      </li>
    </ul>
  </div>
</template>