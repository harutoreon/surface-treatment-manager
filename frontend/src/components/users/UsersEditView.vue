<script setup>
import { onMounted } from 'vue'
import { useUsers } from '@/composables/useUsers.js'

const emit = defineEmits(['message'])
const {
  route,
  router,
  user,
  errorMessage,
  password,
  passwordConfirmation,
  fetchUserInformation,
  userUpdate,
  loggedIn
} = useUsers(emit)

const cancel = () => {
  router.push(`/users/${user.value.id}`)
}

onMounted(async () => {
  if (await loggedIn) await fetchUserInformation(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      ユーザー情報の編集
    </h3>

    <form @submit.prevent="userUpdate">
      <label class="form-label" for="user-name">
        ユーザー名
      </label>
      <input
        id="user-name"
        v-model="user.name"
        class="form-control mb-3 shadow-sm"
        type="text"
        required
      />

      <label class="form-label" for="user-department">
        部署名
      </label>
      <input
        id="user-department"
        v-model="user.department"
        class="form-control mb-3 shadow-sm"
        type="text"
        required
      />

      <label class="form-label" for="user-password">
        パスワード
      </label>
      <input
        id="user-password"
        v-model="password"
        class="form-control mb-3 shadow-sm"
        type="password"
      />

      <label class="form-label" for="user-password-confirmation">
        パスワードの確認
      </label>
      <input
        id="user-password-confirmation"
        v-model="passwordConfirmation"
        class="form-control mb-4 shadow-sm"
        type="password"
      />

      <div class="d-grid gap-2 d-md-block">
        <button type="submit" class="btn btn-primary me-md-2 shadow">
          更新
        </button>
        <button
          v-if="user.id"
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